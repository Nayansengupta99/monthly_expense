package com.expense.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.expense.app.model.UserModel;

public interface UserRepo extends MongoRepository<UserModel, String> {

	UserModel findByEmail(String email);

}
