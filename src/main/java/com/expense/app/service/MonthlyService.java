package com.expense.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expense.app.MonthlyServiceIfc.MonthlyServiceIfc;
import com.expense.app.model.ItemModel;
import com.expense.app.repository.MonthlyExpenseRepo;


@Service
public class MonthlyService implements MonthlyServiceIfc{
	
	
	@Autowired
	private MonthlyExpenseRepo repo;

	@Override
	public ItemModel saveItem(ItemModel model) {
		// TODO Auto-generated method stub
		return repo.save(model);
	}

	@Override
	public List<ItemModel> getItemsByYear(int year) {
		// TODO Auto-generated method stub
		return null;
	}

}
