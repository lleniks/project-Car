const express = require('express');
const Database = require('sqlite3');
const cors = require('cors');
const path = require('path');

const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../'))); 
app.use('/Image', express.static(path.resolve(__dirname, '../Image')));

const db = new Database('users.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    created_at TEXT    DEFAULT (datetime('now','localtime'))
  )
`);
console.log(' База данных подключена: users.db');

app.set('db', db);

app.use('/api', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
    console.log(` Сервер успешно запущен на http://localhost:${PORT}`);
    console.log(` Список машин: http://localhost:${PORT}/api/cars`);
    console.log(` Админ панель: http://localhost:${PORT}/HTML/admin.html`);
});