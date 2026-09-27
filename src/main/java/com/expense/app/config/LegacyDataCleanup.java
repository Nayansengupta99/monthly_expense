package com.expense.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.expense.app.model.ItemModel;
import com.mongodb.client.result.DeleteResult;

/**
 * One-time cleanup for legacy expense records saved before per-user scoping
 * existed (documents with no userEmail).
 *
 * Disabled by default. Enable for a single run with:
 *   PURGE_LEGACY_EXPENSES=true   (env var)  or
 *   app.purge-legacy-expenses=true          (property)
 * Then remove the flag so it does not run again.
 */
@Component
public class LegacyDataCleanup implements CommandLineRunner {

	private final MongoTemplate mongoTemplate;

	@Value("${app.purge-legacy-expenses:false}")
	private boolean purgeEnabled;

	public LegacyDataCleanup(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@Override
	public void run(String... args) {
		if (!purgeEnabled) {
			return;
		}
		Query query = new Query(new Criteria().orOperator(
				Criteria.where("userEmail").exists(false),
				Criteria.where("userEmail").is(null),
				Criteria.where("userEmail").is("")));
		DeleteResult result = mongoTemplate.remove(query, ItemModel.class);
		System.out.println("[LegacyDataCleanup] Deleted " + result.getDeletedCount()
				+ " legacy expense record(s) with no userEmail.");
	}
}
