package com.expense.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.expense.app.model.OtpChallenge;

public interface OtpChallengeRepo extends MongoRepository<OtpChallenge, String> {

}
