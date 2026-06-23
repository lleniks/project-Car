const jwt = require('jsonwebtoken');

const SECRET = 'drivecar_admin_secret_2024';

const ADMIN = {
    login: 'admin',
    password: 'admin123'
};
const login = (req, res) => {
    const { login, password } = req.body;

    if (login === ADMIN.login && password === ADMIN.password) {
        const token = jwt.sign({ role: 'admin', login }, SECRET, { expiresIn: '8h' });
        return res.json({ token });
    }

    res.status(401).json({ message: 'Неверный логин или пароль' });
};

const protect = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Нет токена. Доступ запрещён.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Недостаточно прав. Только для администратора.' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Токен недействителен.' });
    }
};

const requireUser = (req, res, next) => {
    const username = req.headers['x-username'];

    if (!username) {
        return res.status(401).json({ 
            success: false,
            message: 'Требуется авторизация. Пожалуйста, войдите в систему.' 
        });
    }

    req.user = { name: username };
    next();
};

const checkRole = (role) => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (role === 'admin') {
        if (!token) return res.status(401).json({ message: 'Нет токена.' });
        try {
            const decoded = jwt.verify(token, SECRET);
            if (decoded.role !== 'admin') {
                return res.status(403).json({ message: 'Доступ запрещён. Роль: admin.' });
            }
            req.admin = decoded;
            next();
        } catch {
            res.status(403).json({ message: 'Токен недействителен.' });
        }
    } else if (role === 'user') {
        const username = req.headers['x-username'];
        if (!username) {
            return res.status(401).json({ message: 'Доступ запрещён. Требуется вход.' });
        }
        req.user = { name: username };
        next();
    } else {
        res.status(400).json({ message: 'Неизвестная роль.' });
    }
};

module.exports = { login, protect, requireUser, checkRole };