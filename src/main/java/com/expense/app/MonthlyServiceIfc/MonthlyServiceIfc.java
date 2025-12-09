package com.expense.app.MonthlyServiceIfc;

import java.util.List;

import com.expense.app.model.ItemDTO;
import com.expense.app.model.ItemModel;
import com.expense.app.model.ItemMonthlyDTO;

public interface MonthlyServiceIfc {

	public ItemModel saveItem(ItemModel model);
	
	public ItemDTO getItemsByYear(int year);
	
	public ItemMonthlyDTO getItemsByMonth(int month);
	
	
	
	
	
}
