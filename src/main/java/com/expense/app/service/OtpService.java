package com.expense.app.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expense.app.model.OtpChallenge;
import com.expense.app.repository.OtpChallengeRepo;

/**
 * Issues and verifies SMS one-time passwords. On successful verification it
 * delegates to {@link AuthService} to create the same session/user records used
 * by Google login, so downstream expense scoping works identically.
 */
@Service
public class OtpService {

	private static final long CODE_TTL_SECONDS = 300; // 5 minutes
	private static final long RESEND_COOLDOWN_SECONDS = 30;
	private static final int MAX_ATTEMPTS = 5;

	@Autowired
	private OtpChallengeRepo otpRepo;

	@Autowired
	private SmsSender smsSender;

	@Autowired
	private AuthService authService;

	private final SecureRandom random = new SecureRandom();

	/**
	 * Generate and send an OTP for the given phone number. Returns a map with
	 * {@code sent} (whether a real SMS went out) and, in dev mode only,
	 * {@code devCode} so the flow can be tested without a Twilio account.
	 */
	public Map<String, Object> requestOtp(String rawPhone) {
		String phone = normalize(rawPhone);
		LocalDateTime now = LocalDateTime.now();

		OtpChallenge existing = otpRepo.findById(phone).orElse(null);
		if (existing != null && existing.getLastSentAt() != null
				&& existing.getLastSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) {
			throw new IllegalStateException("Please wait a few seconds before requesting another code.");
		}

		String code = String.format("%06d", random.nextInt(1_000_000));

		OtpChallenge challenge = existing != null ? existing : new OtpChallenge();
		challenge.setPhone(phone);
		challenge.setCodeHash(hash(code));
		challenge.setExpiresAt(now.plusSeconds(CODE_TTL_SECONDS));
		challenge.setLastSentAt(now);
		challenge.setAttempts(0);
		otpRepo.save(challenge);

		boolean sent = smsSender.send(phone,
				"Your Monthly Expense Calculator verification code is " + code + ". It expires in 5 minutes.");

		Map<String, Object> response = new HashMap<>();
		response.put("sent", sent);
		if (!sent) {
			// Dev mode (Twilio not configured): surface the code so login is testable.
			response.put("devMode", true);
			response.put("devCode", code);
			System.out.println("[OtpService] DEV MODE OTP for " + phone + " = " + code);
		}
		return response;
	}

	/**
	 * Verify a submitted code. On success returns the same payload as Google
	 * login (sessionId + user). Throws on any failure.
	 */
	public Map<String, Object> verifyOtp(String rawPhone, String code) {
		String phone = normalize(rawPhone);
		if (code == null || code.isBlank()) {
			throw new IllegalArgumentException("Enter the code sent to your phone.");
		}

		OtpChallenge challenge = otpRepo.findById(phone).orElse(null);
		if (challenge == null) {
			throw new IllegalStateException("No code was requested for this number. Please request a new code.");
		}
		if (challenge.getExpiresAt().isBefore(LocalDateTime.now())) {
			otpRepo.deleteById(phone);
			throw new IllegalStateException("This code has expired. Please request a new one.");
		}
		if (challenge.getAttempts() >= MAX_ATTEMPTS) {
			otpRepo.deleteById(phone);
			throw new IllegalStateException("Too many incorrect attempts. Please request a new code.");
		}

		if (!constantTimeEquals(challenge.getCodeHash(), hash(code.trim()))) {
			challenge.setAttempts(challenge.getAttempts() + 1);
			otpRepo.save(challenge);
			throw new IllegalArgumentException("Incorrect code. Please try again.");
		}

		otpRepo.deleteById(phone);
		return authService.establishSession(phone, phone, null);
	}

	private String normalize(String rawPhone) {
		if (rawPhone == null) {
			throw new IllegalArgumentException("Phone number is required.");
		}
		String trimmed = rawPhone.replaceAll("[\\s()-]", "").trim();
		if (!trimmed.matches("\\+[1-9]\\d{6,14}")) {
			throw new IllegalArgumentException("Enter a valid phone number in international format, e.g. +14155552671.");
		}
		return trimmed;
	}

	private String hash(String value) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] out = digest.digest(value.getBytes(StandardCharsets.UTF_8));
			StringBuilder sb = new StringBuilder();
			for (byte b : out) {
				sb.append(String.format("%02x", b));
			}
			return sb.toString();
		} catch (Exception ex) {
			throw new IllegalStateException("Unable to hash OTP", ex);
		}
	}

	private boolean constantTimeEquals(String a, String b) {
		if (a == null || b == null || a.length() != b.length()) {
			return false;
		}
		int result = 0;
		for (int i = 0; i < a.length(); i++) {
			result |= a.charAt(i) ^ b.charAt(i);
		}
		return result == 0;
	}

}
