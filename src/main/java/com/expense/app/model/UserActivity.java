package com.expense.app.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_activities")
public class UserActivity {

	@Id
	private String id;
	private String email;
	private String name;
	private String sessionId;
	private String type;
	private LocalDateTime timeStamp;

	public UserActivity() {
		super();
	}

	public UserActivity(String email, String name, String sessionId, String type, LocalDateTime timeStamp) {
		super();
		this.email = email;
		this.name = name;
		this.sessionId = sessionId;
		this.type = type;
		this.timeStamp = timeStamp;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}

}
