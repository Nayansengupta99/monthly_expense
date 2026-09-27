// One-time cleanup: delete legacy expense records that were saved before
// per-user scoping existed (i.e. documents with no userEmail).
//
// Usage (requires mongosh installed and network access to the DB):
//   mongosh "<YOUR_MONGODB_URI>" scripts/purge-legacy-expenses.js
//
// The URI already points at the monthly_expense_db database, so this script
// operates on the currently-selected database.

const filter = {
  $or: [
    { userEmail: { $exists: false } },
    { userEmail: null },
    { userEmail: '' },
  ],
};

const collection = db.getCollection('ItemCollection');
const toDelete = collection.countDocuments(filter);

print(`Found ${toDelete} legacy expense record(s) with no userEmail.`);

if (toDelete > 0) {
  const result = collection.deleteMany(filter);
  print(`Deleted ${result.deletedCount} legacy expense record(s).`);
} else {
  print('Nothing to delete. Collection is already clean.');
}
