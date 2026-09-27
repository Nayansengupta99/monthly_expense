package com.expense.app;

import java.util.Properties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MonthlyExpenseServiceApplication {

	public static void main(String[] args) {
		Properties props = new Properties();
		String mongoPass = System.getenv().getOrDefault("MONGODB_PASSWORD", "yHsNXoc0TBEzc4Gt");
		String defaultMongoUrl = "mongodb+srv://nayan97:" + mongoPass
				+ "@cluster0.cgcpm.mongodb.net/monthly_expense_db?retryWrites=true&w=majority";
		String mongoDBUrl = System.getenv().getOrDefault("MONGODB_URI", defaultMongoUrl);
		props.put("server.port", System.getenv().getOrDefault("PORT", "8081"));
		props.put("spring.data.mongodb.uri", mongoDBUrl);
		props.put("spring.data.mongodb.databasee", "ItemCollection");
		props.put("spring.jpa.defer-datasource-initialization", "true");
		props.put("app.session.timeout-minutes", "30");
		props.put("app.session.live-window-seconds", "60");
		props.put("app.cors.allowed-origins",
				System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "*"));
		String googleClientId = System.getenv("GOOGLE_CLIENT_ID");
		if (googleClientId != null && !googleClientId.isBlank()) {
			props.put("google.oauth.client-id", googleClientId);
		}
		new SpringApplicationBuilder(MonthlyExpenseServiceApplication.class).properties(props).run(args);
	}

}
