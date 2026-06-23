const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.use('/css', express.static(path.join(frontendPath, 'css')));
app.use('/js', express.static(path.join(frontendPath, 'js')));
app.use('/image', express.static(path.join(frontendPath, 'image')));
app.use('/Image', express.static(path.join(frontendPath, 'Image')));

const carsRouter = require('./routes/carRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');  

app.use('/api', carsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);  

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на порту ${PORT}`);
});