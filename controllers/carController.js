const db = require('../database/db');

const checkApi = (req, res) => {
    res.json({ message: "API works fine" });
};

const getAllCars = (req, res) => {
    const { search, sortBy } = req.query;
    let sql = 'SELECT * FROM cars';
    let params = [];

    if (search) {
        sql += ' WHERE title LIKE ?';
        params.push(`%${search}%`);
    }
    if (sortBy === 'price_asc') {
        sql += " ORDER BY CAST(REPLACE(REPLACE(price, ' ', ''), 'тг/сутки', '') AS INTEGER) ASC";
    } else if (sortBy === 'price_desc') {
        sql += " ORDER BY CAST(REPLACE(REPLACE(price, ' ', ''), 'тг/сутки', '') AS INTEGER) DESC";
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

const getCarById = (req, res) => {
    const carId = req.params.id;
    db.get('SELECT * FROM cars WHERE id = ?', [carId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: `Автомобиль с ID ${carId} не найден` });
        res.status(200).json(row);
    });
};

module.exports = { checkApi, getAllCars, getCarById };