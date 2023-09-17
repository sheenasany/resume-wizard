const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database/resume-wizard-db.sqlite");

const createPersonTableQuery = `
    CREATE TABLE person (
        person_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone_number TEXT,
        link_1 TEXT,
        link_2 TEXT,
        link_3 TEXT,
        summary TEXT
    );
`;

const createExperienceTableQuery = `
    CREATE TABLE experience (
        experience_id INTEGER PRIMARY KEY AUTOINCREMENT,
        person_id INTEGER,
        job_title TEXT,
        company_name TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT,
        FOREIGN KEY (person_id) REFERENCES person(person_id)
    );
`;

const createEducationTableQuery = `
    CREATE TABLE education (
        education_id INTEGER PRIMARY KEY AUTOINCREMENT,
        person_id INTEGER,
        institution_name VARCHAR(255),
        degree TEXT,
        field_of_study TEXT,
        graduation_date TEXT,
        FOREIGN KEY (person_id) REFERENCES person(person_id)
    );
`;


const createJobTableQuery = `
    CREATE TABLE job (
        job_id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        responsibilities TEXT,
        requirements TEXT,
        compensation TEXT,
        benefits TEXT,
        company_values TEXT,
        application_deadline TEXT,
        job_type TEXT,
        summary TEXT
    );
`;

const createPersonExperienceTableQuery = `
    CREATE TABLE person_experience (
        person_id INTEGER,
        experience_id INTEGER,
        PRIMARY KEY (person_id, experience_id),
        FOREIGN KEY (person_id) REFERENCES person(person_id),
        FOREIGN KEY (experience_id) REFERENCES experience(experience_id)
    );
`;

const createPersonEducationTableQuery = `
    CREATE TABLE person_education (
        person_id INTEGER,
        education_id INTEGER,
        PRIMARY KEY (person_id, education_id),
        FOREIGN KEY (person_id) REFERENCES person(person_id),
        FOREIGN KEY (education_id) REFERENCES education(education_id)
    );
`;

const createPersonSkillTableQuery = `
    CREATE TABLE person_skill (
        person_id INTEGER,
        skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_text TEXT,
        FOREIGN KEY (person_id) REFERENCES person(person_id)
    );
`;

const createApplicantJobTableQuery = `
    CREATE TABLE applicant_job (
        applicant_id INTEGER,
        job_id INTEGER,
        PRIMARY KEY (applicant_id, job_id),
        FOREIGN KEY (applicant_id) REFERENCES person(person_id),
        FOREIGN KEY (job_id) REFERENCES job(job_id)
    );
`;

const createJobSkillTableQuery = `
    CREATE TABLE job_skill (
        job_id INTEGER,
        skill_id INTEGER,
        skill_name TEXT,
        skill_description TEXT,
        PRIMARY KEY (job_id, skill_id),
        FOREIGN KEY (job_id) REFERENCES job(job_id),
        FOREIGN KEY (skill_id) REFERENCES skill(skill_id)
    );
`;

const createJobLocationTableQuery = `
    CREATE TABLE job_location (
        job_id INTEGER,
        location_id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        state TEXT,
        country TEXT,
        remote BOOLEAN,
        FOREIGN KEY (job_id) REFERENCES job(job_id)
    );
`;

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON"); // Enable foreign key constraints

  [
    createPersonTableQuery,
    createPersonSkillTableQuery,
    createPersonExperienceTableQuery,
    createPersonEducationTableQuery,
    createExperienceTableQuery,
    createEducationTableQuery,
    createJobTableQuery,
    createApplicantJobTableQuery,
    createJobSkillTableQuery,
    createJobLocationTableQuery,
  ].forEach((query) => {
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table created successfully");
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
  });
});
