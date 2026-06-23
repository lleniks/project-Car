const express = require('express');
const router = express.Router();
const db = require('../database/db');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Все поля обязательны.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Некорректный формат email.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Пароль должен быть от 6 символов.' });
    }

    db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()], (err, existing) => {
        if (err) return res.status(500).json({ success: false, message: 'Ошибка сервера.' });
        if (existing) return res.status(409).json({ success: false, message: 'Email уже зарегистрирован.' });

        db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name.trim(), email.toLowerCase().trim(), password],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: 'Ошибка сервера.' });
                return res.status(201).json({
                    success: true,
                    message: 'Регистрация успешна!',
                    user: { id: this.lastID, name: name.trim(), email: email.toLowerCase().trim() }
                });
            }
        );
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Введите email и пароль.' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: 'Ошибка сервера.' });
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль.' });
        }
        return res.status(200).json({
            success: true,
            message: 'Вход выполнен!',
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});
const { requireUser } = require('../middleware/auth');

router.get('/profile', requireUser, (req, res) => {
    res.json({ 
        success: true,
        message: `Привет, ${req.user.name}! Это твой профиль.`,
        user: req.user
    });
});
module.exports = router;