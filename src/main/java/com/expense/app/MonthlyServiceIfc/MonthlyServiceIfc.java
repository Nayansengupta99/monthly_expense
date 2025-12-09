package com.expense.app.MonthlyServiceIfc;

import java.util.List;

import com.expense.app.model.ItemModel;

public interface MonthlyServiceIfc {

	public ItemModel saveItem(ItemModel model);
	
	public List<ItemModel> getItemsByYear(int year);
	
	
	
	
	
}
