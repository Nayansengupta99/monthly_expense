package com.expense.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

import com.expense.app.model.ItemModel;

public interface MonthlyExpenseRepo extends MongoRepository<ItemModel,Long>{

	List<ItemModel> findByUserEmail(String userEmail);

}
