package com.expense.app.model;

import java.util.List;

public class ItemDTO {

	
	int year;
	List<ItemModel> itemModels;
	int totalYearlyExpense;
	
	public ItemDTO(int year, List<ItemModel> itemModels, int totalYearlyExpense) {
		super();
		this.year = year;
		this.itemModels = itemModels;
		this.totalYearlyExpense = totalYearlyExpense;
	}

	
	
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public List<ItemModel> getItemModels() {
		return itemModels;
	}
	public void setItemModels(List<ItemModel> itemModels) {
		this.itemModels = itemModels;
	}
	public int getTotalYearlyExpense() {
		return totalYearlyExpense;
	}
	public void setTotalYearlyExpense(int totalYearlyExpense) {
		this.totalYearlyExpense = totalYearlyExpense;
	}

	



}
