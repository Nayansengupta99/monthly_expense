package com.expense.app.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.expense.app.model.ActiveSession;

public interface ActiveSessionRepo extends MongoRepository<ActiveSession, String> {

	List<ActiveSession> findByLastSeenAfter(LocalDateTime cutoff);

	List<ActiveSession> findByLastSeenBefore(LocalDateTime cutoff);

}
