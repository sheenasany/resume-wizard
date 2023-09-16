const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/resume-wizard-db.sqlite'); // Change 'your_database_name.sqlite' to the desired database name.

// Define your schema here
const createTablesQuery = `
    CREATE TABLE \`experience\` (
        \`experience_id\` INT,
        \`person_id\` INT,
        \`job_title\` VARCHAR(100),
        \`company_name\` VARCHAR(100),
        \`start_date\` DATE,
        \`end_date\` DATE,
        \`description\` TEXT,
        PRIMARY KEY (\`experience_id\`)
    );
  
    CREATE TABLE \`person_experience\` (
        \`person_id\` INT,
        \`experience_id\` INT,
        PRIMARY KEY (\`person_id\`, \`experience_id\`),
        FOREIGN KEY (\`experience_id\`) REFERENCES \`experience\`(\`experience_id\`)
    );
  
    CREATE TABLE \`education\` (
        \`education_id\` INT,
        \`person_id\` INT,
        \`institution_name\` VARCHAR(100),
        \`degree\` VARCHAR(100),
        \`field_of_study\` VARCHAR(100),
        \`graduation_date\` DATE,
        PRIMARY KEY (\`education_id\`)
    );
  
    CREATE TABLE \`person_education\` (
        \`person_id\` INT,
        \`education_id\` INT,
        PRIMARY KEY (\`person_id\`, \`education_id\`),
        FOREIGN KEY (\`education_id\`) REFERENCES \`education\`(\`education_id\`)
    );
  
    CREATE TABLE \`skill\` (
        \`skill_id\` INT,
        \`skill_name\` VARCHAR(50),
        PRIMARY KEY (\`skill_id\`)
    );
  
    CREATE TABLE \`person_skill\` (
        \`person_id\` INT,
        \`skill_id\` INT,
        PRIMARY KEY (\`person_id\`, \`skill_id\`),
        FOREIGN KEY (\`skill_id\`) REFERENCES \`skill\`(\`skill_id\`)
    );
  
    CREATE TABLE \`applicant_job\` (
        \`applicant_id\` INT,
        \`job_id\` INT,
        PRIMARY KEY (\`applicant_id\`, \`job_id\`)
    );
  
    CREATE TABLE \`person\` (
        \`person_id\` INT,
        \`first_name\` VARCHAR(50),
        \`last_name\` VARCHAR(50),
        \`email\` VARCHAR(50),
        \`phone_number\` VARCHAR(15),
        \`link_1\` VARCHAR(255),
        \`link_2\` VARCHAR(255),
        \`link_3\` VARCHAR(255),
        PRIMARY KEY (\`person_id\`),
        FOREIGN KEY (\`person_id\`) REFERENCES \`experience\`(\`person_id\`),
        FOREIGN KEY (\`person_id\`) REFERENCES \`person_education\`(\`person_id\`),
        FOREIGN KEY (\`person_id\`) REFERENCES \`education\`(\`person_id\`),
        FOREIGN KEY (\`person_id\`) REFERENCES \`person_experience\`(\`person_id\`),
        FOREIGN KEY (\`person_id\`) REFERENCES \`applicant_job\`(\`applicant_id\`),
        FOREIGN KEY (\`person_id\`) REFERENCES \`person_skill\`(\`person_id\`)
    );
  
    CREATE TABLE \`job_skill\` (
        \`job_id\` INT,
        \`skill_id\` INT,
        \`skill_name\` VARCHAR(50),
        \`skill_discription\` TEXT,
        PRIMARY KEY (\`skill_id\`)
    );
  
    CREATE TABLE \`job_location\` (
        \`job_id\` INT,
        \`location_id\` INT,
        \`city\` VARCHAR(255),
        \`state\` VARCHAR(255),
        \`country\` VARCHAR(255),
        \`remote\` BOOLEAN,
        PRIMARY KEY (\`location_id\`)
    );
  
    CREATE TABLE \`job\` (
        \`job_id\` INT,
        \`description\` TEXT,
        \`responsibilities\` TEXT,
        \`requirements\` TEXT,
        \`compensation\` VARCHAR(100),
        \`benefits\` TEXT,
        \`company_values\` TEXT,
        \`application_deadline\` DATETIME,
        \`job_type\` TEXT,
        PRIMARY KEY (\`job_id\`),
        FOREIGN KEY (\`job_id\`) REFERENCES \`applicant_job\`(\`job_id\`),
        FOREIGN KEY (\`job_id\`) REFERENCES \`job_skill\`(\`job_id\`),
        FOREIGN KEY (\`job_id\`) REFERENCES \`job_location\`(\`job_id\`)
    );
`;

// Execute the schema to create tables
db.serialize(() => {
    db.run(createTablesQuery, (err) => {
        if (err) {
            console.error('Error creating tables:', err.message);
        } else {
            console.log('Tables created successfully');
        }

        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    });
});
