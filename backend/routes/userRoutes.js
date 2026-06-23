const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireUser } = require('../middleware/auth');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Все поля обязательны.' });
    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Некорректный email.' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Пароль от 6 символов.' });

    try {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
        if (existing) return res.status(409).json({ success: false, message: 'Email уже зарегистрирован.' });
        const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name.trim(), email.toLowerCase().trim(), password);
        res.status(201).json({ success: true, message: 'Регистрация успешна!', user: { id: info.lastInsertRowid, name: name.trim(), email: email.toLowerCase().trim() } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Ошибка сервера.' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Введите email и пароль.' });

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
        if (!user || user.password !== password) return res.status(401).json({ success: false, message: 'Неверный email или пароль.' });
        res.status(200).json({ success: true, message: 'Вход выполнен!', user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Ошибка сервера.' });
    }
});

router.get('/profile', requireUser, (req, res) => {
    res.json({ success: true, message: `Привет, ${req.user.name}!`, user: req.user });
});

module.exports = router;