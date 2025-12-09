package com.expense.app.model;

import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ItemCollection")
public class ItemModel {

	@Id
	private String id;
	private String itemName;
	private double price;
	private LocalDateTime timeStamp;

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ItemModel other = (ItemModel) obj;
		return Objects.equals(id, other.id);
	}

	public ItemModel() {
		super();
	}

	public ItemModel(String id, String itemName, double price, LocalDateTime timeStamp) {
		super();
		this.id = id;
		this.itemName = itemName;
		this.price = price;
		this.timeStamp = timeStamp;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}

}
