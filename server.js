const express = require('express');
const app = express();

const Database = require('./database/database.js');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

const db = new Database('database/resume-wizard-db.sqlite');

// Define routes for home page, App, and Settings
app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/App', (req, res) => {
  res.render('pages/app');
});

app.get('/Settings', (req, res) => {
  res.render('pages/settings');
});

// Define a route to handle the query
app.get('/query', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM experience', []);
    res.render('partials/queryResult', { rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    db.close((err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Database connection closed');
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
