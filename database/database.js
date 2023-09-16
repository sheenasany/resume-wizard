const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  query(queryString, params, callback) {
    this.db.all(queryString, params, (err, rows) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }

      callback(null, rows);
    });
  }

  // Method to insert data
  insert(tableName, columns, values, callback) {
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;
    this.db.run(query, values, function(err) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      callback(null, this.lastID); // Return the ID of the inserted row
    });
  }

  // Method to delete data
  delete(tableName, condition, params, callback) {
    const query = `DELETE FROM ${tableName} WHERE ${condition}`;
    this.db.run(query, params, function(err) {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      callback(null, this.changes); // Return the number of affected rows
    });
  }

  // Method for a simple join operation
  join(query, params, callback) {
    this.query(query, params, callback);
  }

  // Method to close the database connection
  close(callback) {
    this.db.close((err) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }

      console.log('Database connection closed');
      callback(null);
    });
  }
}

module.exports = Database;
