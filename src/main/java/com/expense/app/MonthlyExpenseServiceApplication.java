package com.expense.app;

import java.util.Properties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
public class MonthlyExpenseServiceApplication {

	public static void main(String[] args) {
		Properties props = new Properties();
		String mongoPass = "yHsNXoc0TBEzc4Gt";
		String mongoDBUrl = "mongodb+srv://nayan97:" + mongoPass
				+ "@cluster0.cgcpm.mongodb.net/monthly_expense_db?retryWrites=true&w=majority";
		props.put("server.port", "8081");
		props.put("spring.data.mongodb.uri", mongoDBUrl);
		props.put("spring.data.mongodb.databasee", "ItemCollection");
		props.put("spring.jpa.defer-datasource-initialization", "true");
		new SpringApplicationBuilder(MonthlyExpenseServiceApplication.class).properties(props).run(args);
	}

}
