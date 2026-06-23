const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.use('/JS', express.static(path.join(__dirname, '../frontend/JS')));

app.use('/HTML', express.static(path.join(frontendPath, 'HTML')));
app.use('/JS', express.static(path.join(frontendPath, 'JS')));
app.use('/js', express.static(path.join(frontendPath, 'JS')));

const carsRouter = require('./routes/carRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api', carsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API Route Not Found' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server successfully running on port ${PORT}`);
});
