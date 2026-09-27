package com.expense.app.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "active_sessions")
public class ActiveSession {

	@Id
	private String sessionId;
	private String email;
	private String name;
	private String picture;
	private LocalDateTime loginTime;
	private LocalDateTime lastSeen;
	private boolean idle;

	public ActiveSession() {
		super();
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public LocalDateTime getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(LocalDateTime loginTime) {
		this.loginTime = loginTime;
	}

	public LocalDateTime getLastSeen() {
		return lastSeen;
	}

	public void setLastSeen(LocalDateTime lastSeen) {
		this.lastSeen = lastSeen;
	}

	public boolean isIdle() {
		return idle;
	}

	public void setIdle(boolean idle) {
		this.idle = idle;
	}

}
