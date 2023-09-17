const express = require("express");
const LLM = require("./lib/ai");
const multer = require("multer");
const PDFParser = require("pdf-parse");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ai = new LLM();

const Database = require("./database/database.js");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files (CSS, images, etc.)
app.use(express.static("public"));

const db = new Database("database/resume-wizard-db.sqlite");

// Define storage for uploaded files
const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({ storage: storage });

// Handle the file upload

function makeTextNatural(rawText) {
  // Remove extra white spaces and line breaks
  let text = rawText.replace(/\s+/g, " ").trim();

  // Sentence capitalization
  text = text.replace(
    /([.!?]\s+|^)(\w)/g,
    (match, separator, char) => separator + char.toUpperCase()
  );

  // Remove line breaks in the middle of sentences
  text = text.replace(/-\s+/g, "");

  // Remove special characters if needed
  // text = text.replace(/[^\x20-\x7E]+/g, '');

  return text;
}

app.post("/api/upload", upload.single("resume"), async (req, res) => {
  console.log("File", req.file);

  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).send("Error: No file uploaded");
  }

  const name = req.file.originalname;

  // Validate file type (assuming 'mimetype' property exists in your req.file)
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).send("Error: Uploaded file is not a PDF");
  }

  // Access the uploaded file as a buffer
  const buffer = req.file.buffer;

  try {
    // Parse the PDF buffer
    const data = await PDFParser(buffer);
    //console.log("Data", data);

    // Process the data and insert it into the database
    // Example:
    const textContent = data.text;
    // console.log("Text content", textContent);
    // Insert 'textContent' into your database
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: textContent,
      },
    ];
    const personDetails = await ai.callOpenAi(
      messages,
      ai.extractPersonDetails
    );
    // const personSkills = await ai.callOpenAi(messages, ai.extractPersonSkills);
    // const personEducation = await ai.callOpenAi(
    //   messages,
    //   ai.extractPersonEducation
    // );
    // const personExperience = await ai.callOpenAi(
    //   messages,
    //   ai.extractPersonExperience
    // );
    const personDetailsJson = JSON.parse(
      personDetails.message.function_call.arguments
    );
    // const personEducationJson = JSON.parse(
    //   personEducation.message.function_call.arguments
    // );
    // const personSkillsJson = JSON.parse(
    //   personSkills.message.function_call.arguments
    // );
    // const personExperienceJson = JSON.parse(
    //   personExperience.message.function_call.arguments
    // );

    const dbres = await db.query(
      "INSERT INTO person (first_name, last_name, email, phone_number, link_1, link_2) VALUES (?, ?, ?, ?, ?, ?)",
      [
        personDetailsJson.firstname,
        personDetailsJson.lastname,
        personDetailsJson.email,
        personDetailsJson.phonenumber,
        personDetailsJson.link1,
        personDetailsJson.link2,
      ]
    );

    res.render("partials/disabled-form", { name });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error parsing the PDF");
  }
});

// Define routes for home page, App, and Settings
app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/test", (req, res) => {
  res.render("partials/disabled-form");
});
app.post("/test", (req, res) => {
  res.render("partials/disabled-form");
});

app.get("/App", (req, res) => {
  res.render("pages/app");
});

app.get("/Settings", (req, res) => {
  res.render("pages/settings");
});

// Define a route to handle the query
app.get("/query", async (req, res) => {
  try {
    const rows = await db.query("SELECT * FROM person", []);
    // res.render("partials/queryResult", { rows });
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
    // db.close((err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("Database connection closed");
    // });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
