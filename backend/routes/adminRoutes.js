// ЖЕЛЕЗОБЕТОННЫЙ ПЕРЕХВАТЧИК ОШИБОК ДЛЯ РЕНДЕРА
process.on('uncaughtException', (err) => {
    console.error('==================================================');
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА ПРИ СТАРТЕ СЕРВЕРА:');
    console.error(err.message);
    console.error('Файл и строчка:', err.stack ? err.stack.split('\n')[1] : 'Неизвестно');
    console.error('==================================================');
    process.exit(1);
});
const express = require('express');
const router = express.Router();
const { login, protect, checkRole } = require('../middleware/auth');
const { addCar, updateCar, deleteCar } = require('../controllers/adminController');

router.post('/login', login);
router.post('/cars', protect, addCar);
router.put('/cars/:id', protect, updateCar);
router.delete('/cars/:id', protect, deleteCar);

router.get('/dashboard', checkRole('admin'), (req, res) => {
    res.json({ message: `Добро пожаловать, ${req.admin.login}! Это админ-панель.` });
});

module.exports = router;