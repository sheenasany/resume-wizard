const Database = require('database/database.js');
const db = new Database('database/resume-wizard-db.sqlite'); // Adjust the path to your database file

// Example usage:
db.query('SELECT * FROM experience', [], (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(rows);
});

