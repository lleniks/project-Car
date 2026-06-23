
const Database = require('sqlite3');
const db = new Database('./database/project.db'); 

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    created_at TEXT    DEFAULT (datetime('now','localtime'))
  )
`);

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Все поля обязательны для заполнения.'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Некорректный формат email.'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Пароль должен содержать не менее 6 символов.'
        });
    }

    const existing = db
        .prepare('SELECT id FROM users WHERE email = ?')
        .get(email.toLowerCase().trim());

    if (existing) {
        return res.status(409).json({
            success: false,
            message: 'Пользователь с таким email уже зарегистрирован.'
        });
    }

    try {
        const info = db
            .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
            .run(name.trim(), email.toLowerCase().trim(), password);

        console.log(` Новый пользователь: ${name} <${email}> id=${info.lastInsertRowid}`);

        return res.status(201).json({
            success: true,
            message: 'Регистрация успешна!',
            user: {
                id: info.lastInsertRowid,
                name: name.trim(),
                email: email.toLowerCase().trim()
            }
        });
    } catch (err) {
        console.error('Ошибка БД:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера.'
        });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Введите email и пароль.'
        });
    }

    const user = db
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email.toLowerCase().trim());

    if (!user || user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Неверный email или пароль.'
        });
    }

    console.log(`🔑 Вход: ${user.name} <${user.email}>`);

    return res.status(200).json({
        success: true,
        message: 'Вход выполнен!',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
};

module.exports = { register, login };