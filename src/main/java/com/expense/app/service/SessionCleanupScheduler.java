package com.expense.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SessionCleanupScheduler {

	@Autowired
	private AuthService authService;

	/** Every minute, expire sessions that have been idle beyond the timeout. */
	@Scheduled(fixedRate = 60000)
	public void cleanup() {
		try {
			authService.expireStaleSessions();
		} catch (Exception ignored) {
			// DB may be briefly unavailable; skip this run.
		}
	}

}
