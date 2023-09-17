const chai = require('chai');
const expect = chai.expect;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/resume-wizard-db.sqlite'); // Make sure the database file path is correct

// Create fresh database using create_database.js
const exec = require('child_process').exec;

before((done) => {
  const createDatabaseProcess = exec('node database/create_database.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating database: ${error}`);
      return;
    }
    console.log(`Database created successfully: ${stdout}`);
    done();
  });
});

describe('Database Operations', () => {
  it('should be able to query data', (done) => {
    db.all('SELECT * FROM experience', (err, rows) => {
      expect(err).to.be.null;
      expect(rows).to.be.an('array');
      done();
    });
  });

  it('should be able to insert data', (done) => {
    db.run('INSERT INTO experience (experience_id, person_id, job_title, company_name, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [1, 1, 'Job Title', 'Company Name', '2022-01-01', '2022-12-31', 'Description'],
      (err) => {
        expect(err).to.be.null;
        done();
      });
  });

  it('should be able to edit data', (done) => {
    db.run('UPDATE experience SET job_title = ? WHERE experience_id = ?',
      ['New Job Title', 1],
      (err) => {
        expect(err).to.be.null;
        done();
      });
  });

  // Add more tests for other operations as needed
});

describe('Person Schema', () => {
  before((done) => {
    const createDatabaseProcess = exec('node database/create_database.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating database: ${error}`);
        return;
      }
      console.log(`Database created successfully: ${stdout}`);
      done();
    });
  });

  it('should be able to insert a new person', (done) => {
    db.run('INSERT INTO person (person_id, first_name, last_name, email, phone_number, link_1, link_2, link_3, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [1, 'John', 'Doe', 'john@example.com', '123-456-7890', 'link1', 'link2', 'link3', 'Summary'],
      (err) => {
        expect(err).to.be.null;
        done();
      });
  });

  it('should be able to query data from person', (done) => {
    db.all('SELECT * FROM person WHERE person_id = ?', [1], (err, rows) => {
      expect(err).to.be.null;
      expect(rows).to.be.an('array');
      expect(rows).to.have.lengthOf(1);
      expect(rows[0].first_name).to.equal('John');
      // Add more assertions as needed
      done();
    });
  });

  after((done) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      done();
    });
  });
});
