const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//     req.url = req.url.toLowerCase();
//     next();
// });

app.use(express.static(path.resolve(__dirname, '../frontend')));
app.use(express.static(path.resolve(__dirname, '../frontend/HTML')));
app.use('/image', express.static(path.resolve(__dirname, '../frontend/Image')));

const carsRouter = require('./routes/carRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api', carsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
