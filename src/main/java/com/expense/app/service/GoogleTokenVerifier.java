package com.expense.app.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Verifies Google ID tokens using Google's public tokeninfo endpoint. This keeps
 * the SPA login flow simple: the browser obtains an ID token via Google Identity
 * Services and the backend validates it here before creating a session.
 */
@Service
public class GoogleTokenVerifier {

	private static final String TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

	@Value("${google.oauth.client-id:}")
	private String clientId;

	private final RestTemplate restTemplate = new RestTemplate();

	@SuppressWarnings("unchecked")
	public Map<String, Object> verify(String idToken) {
		if (idToken == null || idToken.isBlank()) {
			throw new IllegalArgumentException("Missing Google ID token");
		}

		Map<String, Object> claims = restTemplate.getForObject(TOKEN_INFO_URL + idToken, Map.class);
		if (claims == null || claims.get("sub") == null) {
			throw new IllegalArgumentException("Invalid Google ID token");
		}

		// If a client id is configured, enforce the audience matches.
		Object aud = claims.get("aud");
		if (clientId != null && !clientId.isBlank() && aud != null && !clientId.equals(aud.toString())) {
			throw new IllegalArgumentException("Google token audience mismatch");
		}

		return claims;
	}

}
