
import express from 'express';
import pg from 'pg';

// Access the Pool class from the pg default export
const { Pool } = pg;
import cors from 'cors';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const app = express();
//app.use(cors());
// Enable CORS middleware for specific origins
app.use(cors({
    origin: process.env.REDIRECT_URL
}));

// Use Pool from 'pg' module
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: {
        rejectUnauthorized: false, // You can set this to true if you have a valid CA certificate
        // Other SSL options can be specified here
    }
});

// Check if the PostgreSQL connection is successful
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

app.get('/', (req, res) => {
    //return res.json("From BackEnd Side");
    pool.query('SELECT * FROM book', (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({ error: 'Error executing query' });
        }
        return res.json(result.rows);
    });
});

app.get('/book', (req, res) => {
    // Example query to select all rows from the 'book' table
    pool.query('SELECT * FROM book', (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({ error: 'Error executing query' });
        }
        return res.json(result.rows);
    });
});

app.listen(3000, () => {
    console.log("listening");
})

export default app;