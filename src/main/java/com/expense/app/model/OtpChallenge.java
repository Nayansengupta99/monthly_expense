package com.expense.app.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * A pending SMS OTP challenge, keyed by phone number so a new request replaces
 * any previous one for the same number.
 */
@Document(collection = "otp_challenges")
public class OtpChallenge {

	@Id
	private String phone;
	private String codeHash;
	private LocalDateTime expiresAt;
	private LocalDateTime lastSentAt;
	private int attempts;

	public OtpChallenge() {
		super();
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCodeHash() {
		return codeHash;
	}

	public void setCodeHash(String codeHash) {
		this.codeHash = codeHash;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(LocalDateTime expiresAt) {
		this.expiresAt = expiresAt;
	}

	public LocalDateTime getLastSentAt() {
		return lastSentAt;
	}

	public void setLastSentAt(LocalDateTime lastSentAt) {
		this.lastSentAt = lastSentAt;
	}

	public int getAttempts() {
		return attempts;
	}

	public void setAttempts(int attempts) {
		this.attempts = attempts;
	}

}
