package com.expense.app.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Sends SMS messages via Twilio's REST API (no SDK dependency). When Twilio
 * credentials are not configured the sender is in "dev mode": it does not send
 * a real SMS, allowing local testing where the OTP is surfaced another way.
 */
@Service
public class SmsSender {

	@Value("${twilio.account-sid:}")
	private String accountSid;

	@Value("${twilio.auth-token:}")
	private String authToken;

	@Value("${twilio.from-number:}")
	private String fromNumber;

	private final RestTemplate restTemplate = new RestTemplate();

	/** True only when all Twilio settings are present. */
	public boolean isConfigured() {
		return notBlank(accountSid) && notBlank(authToken) && notBlank(fromNumber);
	}

	/**
	 * Send an SMS. Returns true if a real message was dispatched, false if the
	 * sender is in dev mode (not configured).
	 */
	public boolean send(String toPhone, String body) {
		if (!isConfigured()) {
			return false;
		}

		String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String basic = Base64.getEncoder()
				.encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));
		headers.set(HttpHeaders.AUTHORIZATION, "Basic " + basic);

		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
		form.add("To", toPhone);
		form.add("From", fromNumber);
		form.add("Body", body);

		restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);
		return true;
	}

	private boolean notBlank(String value) {
		return value != null && !value.isBlank();
	}

}
