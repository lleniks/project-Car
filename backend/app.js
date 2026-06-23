const express = require('express');
process.on('uncaughtException', (err) => {
    console.error('КРИТИЧЕСКАЯ ОШИБКА НА СЕРВЕРЕ:', err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('НЕОБРАБОТАННОЕ ИСКЛЮЧЕНИЕ:', reason);
});
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

app.use(cors());
app.use(express.json());
const frontendPath = process.env.RAILWAY_ENVIRONMENT 
    ? path.resolve(__dirname, 'frontend')
    : path.resolve(__dirname, '../frontend');

app.use(express.static(frontendPath));
app.use('/Image', express.static(path.join(frontendPath, 'Image')));

const carsRouter = require('./routes/carRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');  

app.use('/api', carsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);  

app.use((req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});