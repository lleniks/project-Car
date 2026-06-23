const db = require('../database/db');

const checkApi = (req, res) => res.json({ message: "API works fine" });

const getAllCars = (req, res) => {
    const { search, sortBy } = req.query;
    let sql = 'SELECT * FROM cars';
    const params = [];

    if (search) { sql += ' WHERE title LIKE ?'; params.push(`%${search}%`); }
    if (sortBy === 'price_asc') sql += " ORDER BY CAST(REPLACE(REPLACE(price, ' ', ''), 'тг/сутки', '') AS INTEGER) ASC";
    else if (sortBy === 'price_desc') sql += " ORDER BY CAST(REPLACE(REPLACE(price, ' ', ''), 'тг/сутки', '') AS INTEGER) DESC";

    try {
        res.status(200).json(db.prepare(sql).all(params));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCarById = (req, res) => {
    try {
        const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
        if (!row) return res.status(404).json({ message: `Автомобиль не найден` });
        res.status(200).json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { checkApi, getAllCars, getCarById };