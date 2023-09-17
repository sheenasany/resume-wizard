const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  // Method to query the database
  query(queryString, params) {
    return new Promise((resolve, reject) => {
      this.db.all(queryString, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
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
