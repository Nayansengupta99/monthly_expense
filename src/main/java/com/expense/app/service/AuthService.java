package com.expense.app.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.expense.app.model.ActiveSession;
import com.expense.app.model.UserActivity;
import com.expense.app.model.UserModel;
import com.expense.app.repository.ActiveSessionRepo;
import com.expense.app.repository.UserActivityRepo;
import com.expense.app.repository.UserRepo;

@Service
public class AuthService {

	@Autowired
	private GoogleTokenVerifier verifier;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private UserActivityRepo activityRepo;

	@Autowired
	private ActiveSessionRepo sessionRepo;

	@Value("${app.session.timeout-minutes:30}")
	private long sessionTimeoutMinutes;

	@Value("${app.session.live-window-seconds:60}")
	private long liveWindowSeconds;

	/** Verify Google token, upsert the user, create a session, log the login. */
	public Map<String, Object> loginWithGoogle(String idToken) {
		Map<String, Object> claims = verifier.verify(idToken);
		String email = String.valueOf(claims.getOrDefault("email", ""));
		String name = String.valueOf(claims.getOrDefault("name", email));
		String picture = claims.get("picture") == null ? null : claims.get("picture").toString();

		LocalDateTime now = LocalDateTime.now();
		UserModel user = userRepo.findByEmail(email);
		if (user == null) {
			user = new UserModel();
			user.setEmail(email);
			user.setFirstLogin(now);
		}
		user.setName(name);
		user.setPicture(picture);
		user.setLastLogin(now);
		userRepo.save(user);

		String sessionId = UUID.randomUUID().toString();
		ActiveSession session = new ActiveSession();
		session.setSessionId(sessionId);
		session.setEmail(email);
		session.setName(name);
		session.setPicture(picture);
		session.setLoginTime(now);
		session.setLastSeen(now);
		session.setIdle(false);
		sessionRepo.save(session);

		logActivity(email, name, sessionId, "LOGIN", now);

		Map<String, Object> response = new HashMap<>();
		response.put("sessionId", sessionId);
		Map<String, Object> userInfo = new HashMap<>();
		userInfo.put("email", email);
		userInfo.put("name", name);
		userInfo.put("picture", picture);
		response.put("user", userInfo);
		return response;
	}

	/** Record a heartbeat: refresh lastSeen and idle flag, log the state. */
	public void heartbeat(String sessionId, boolean idle) {
		if (sessionId == null) {
			return;
		}
		ActiveSession session = sessionRepo.findById(sessionId).orElse(null);
		if (session == null) {
			return;
		}
		LocalDateTime now = LocalDateTime.now();
		session.setLastSeen(now);
		session.setIdle(idle);
		sessionRepo.save(session);
		logActivity(session.getEmail(), session.getName(), sessionId, idle ? "IDLE" : "ACTIVE", now);
	}

	/** Explicit logout: log it and remove the active session. */
	public void logout(String sessionId) {
		if (sessionId == null) {
			return;
		}
		ActiveSession session = sessionRepo.findById(sessionId).orElse(null);
		if (session != null) {
			logActivity(session.getEmail(), session.getName(), sessionId, "LOGOUT", LocalDateTime.now());
			sessionRepo.deleteById(sessionId);
		}
	}

	/** Resolve the logged-in user's email from an active session id, or null. */
	public String emailForSession(String sessionId) {
		if (sessionId == null || sessionId.isBlank()) {
			return null;
		}
		ActiveSession session = sessionRepo.findById(sessionId).orElse(null);
		return session == null ? null : session.getEmail();
	}

	/** Live users = sessions seen within the live window (default 60s). */
	public long liveUserCount() {		LocalDateTime cutoff = LocalDateTime.now().minusSeconds(liveWindowSeconds);
		return sessionRepo.findByLastSeenAfter(cutoff).size();
	}

	/** Scheduled cleanup: expire sessions idle beyond the timeout. */
	public void expireStaleSessions() {
		LocalDateTime cutoff = LocalDateTime.now().minusMinutes(sessionTimeoutMinutes);
		List<ActiveSession> stale = sessionRepo.findByLastSeenBefore(cutoff);
		for (ActiveSession session : stale) {
			logActivity(session.getEmail(), session.getName(), session.getSessionId(), "AUTO_LOGOUT",
					LocalDateTime.now());
			sessionRepo.deleteById(session.getSessionId());
		}
	}

	private void logActivity(String email, String name, String sessionId, String type, LocalDateTime when) {
		activityRepo.save(new UserActivity(email, name, sessionId, type, when));
	}

}
