package com.expense.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.expense.app.model.UserActivity;

public interface UserActivityRepo extends MongoRepository<UserActivity, String> {

}
