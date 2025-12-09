package com.expense.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.app.MonthlyServiceIfc.MonthlyServiceIfc;
import com.expense.app.model.ItemModel;

@RestController
@RequestMapping("/expense")
public class MonthlyServiceController {

	
	@Autowired
	MonthlyServiceIfc ifc;
	
	@PostMapping("/save")
	public ItemModel saveModel(@RequestBody  ItemModel model) {
		return ifc.saveItem(model);
		
	}
	
	
}
