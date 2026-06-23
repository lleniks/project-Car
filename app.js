const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'frontend')));
app.use('/Image', express.static(path.resolve(__dirname, 'frontend/Image')));

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
