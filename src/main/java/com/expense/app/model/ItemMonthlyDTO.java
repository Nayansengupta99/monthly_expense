package com.expense.app.model;

import java.util.List;

public class ItemMonthlyDTO {

	int month;
	List<ItemModel> itemModels;
	int totalMonthlyExpense;
	
	
	
	public ItemMonthlyDTO(int month, List<ItemModel> itemModels, int totalMonthlyExpense) {
		super();
		this.month = month;
		this.itemModels = itemModels;
		this.totalMonthlyExpense = totalMonthlyExpense;
	}
	
	
	
	
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	public List<ItemModel> getItemModels() {
		return itemModels;
	}
	public void setItemModels(List<ItemModel> itemModels) {
		this.itemModels = itemModels;
	}
	public int getTotalMonthlyExpense() {
		return totalMonthlyExpense;
	}
	public void setTotalMonthlyExpense(int totalMonthlyExpense) {
		this.totalMonthlyExpense = totalMonthlyExpense;
	}

	
	
}
