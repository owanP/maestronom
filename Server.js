const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();

// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     
  password: '', 
  database: 'tugas2510',
});

// Connect to database  
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1); 
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/products', (req, res) => {
  let sql = 'SELECT * FROM product'; 
  const params = [];
  
  if (req.query.category) {
    sql += ' WHERE category = ?';
    params.push(req.query.category);
  }
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/products/:id', (req, res) => {
    db.query('SELECT * FROM product WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results[0] || {});
    });
});

// HTML Routes

// Add this new API route before the HTML routes
app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM product';
    const conditions = [];
    
    if (req.query.category && req.query.category !== '') {
        conditions.push(`category = '${req.query.category}'`);
    }
    
    // Selling type filter ('all' means all types)
    if (req.query.selling_type && req.query.selling_type !== 'all') {
        conditions.push(`selling_type = '${req.query.selling_type}'`);
    }
    
    // Apply conditions if any exist
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Basic sorting
    if (req.query.selling_type === 'new') {
        sql += ' ORDER BY created_at DESC';
    } else if (req.query.selling_type === 'best') {
        sql += ' ORDER BY sales_count DESC';
    }
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);

    // Both filters are applied simultaneously
    conditions.push(`category = '${req.query.category}'`);
    conditions.push(`selling_type = '${req.query.selling_type}'`);
    });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


