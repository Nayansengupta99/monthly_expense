package com.expense.app.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expense.app.MonthlyServiceIfc.MonthlyServiceIfc;
import com.expense.app.model.ItemDTO;
import com.expense.app.model.ItemModel;
import com.expense.app.model.ItemMonthlyDTO;
import com.expense.app.repository.MonthlyExpenseRepo;

@Service
public class MonthlyService implements MonthlyServiceIfc {

	@Autowired
	private MonthlyExpenseRepo repo;

	@Override
	public ItemModel saveItem(ItemModel model) {
		// TODO Auto-generated method stub
		if (model.getTimeStamp() == null) {
			model.setTimeStamp(LocalDateTime.now());
		}
		return repo.save(model);
	}

	@Override
	public ItemDTO getItemsByYear(int year) {
		// TODO Auto-generated method stub

		List<ItemModel> items = repo.findAll();
		ItemDTO itemDTO = new ItemDTO(year,
				items.stream().filter(x -> x.getTimeStamp().getYear() == year).collect(Collectors.toList()),
				(int) items.stream().filter(x -> x.getTimeStamp().getYear() == year).mapToDouble(ItemModel::getPrice)
						.sum());
		return itemDTO;
	}

	@Override
	public ItemMonthlyDTO getItemsByMonth(int month) {
		// TODO Auto-generated method stub

		List<ItemModel> items = repo.findAll();

		ItemMonthlyDTO monthlyDTO = new ItemMonthlyDTO(month,
				items.stream().filter(x -> x.getTimeStamp().getMonthValue() == month).collect(Collectors.toList()),
				(int) items.stream().filter(x -> x.getTimeStamp().getMonthValue() == month)
						.mapToDouble(ItemModel::getPrice).sum());

		return monthlyDTO;

	}

}
