const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.url = req.url.toLowerCase();
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'HTML', 'catalog.html'));
});
 
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'HTML', 'login.html'));
});

app.get('/kontakt', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'HTML', 'kontakt.html'));
});

app.get('/kabinet', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'HTML', 'kabinet.html'));
});

app.use((req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});