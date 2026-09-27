package com.expense.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.app.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/google")
	public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
		try {
			String idToken = body.get("idToken");
			return ResponseEntity.ok(authService.loginWithGoogle(idToken));
		} catch (Exception ex) {
			return ResponseEntity.status(401).body(Map.of("error", ex.getMessage()));
		}
	}

	@PostMapping("/heartbeat")
	public ResponseEntity<?> heartbeat(@RequestBody Map<String, Object> body) {
		String sessionId = body.get("sessionId") == null ? null : body.get("sessionId").toString();
		boolean idle = Boolean.parseBoolean(String.valueOf(body.getOrDefault("idle", false)));
		authService.heartbeat(sessionId, idle);
		return ResponseEntity.ok(Map.of("ok", true));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
		authService.logout(body.get("sessionId"));
		return ResponseEntity.ok(Map.of("ok", true));
	}

	@GetMapping("/live-users")
	public ResponseEntity<?> liveUsers() {
		return ResponseEntity.ok(Map.of("count", authService.liveUserCount()));
	}

}
