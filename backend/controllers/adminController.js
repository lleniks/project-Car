const db = require('../database/db');

const addCar = (req, res) => {
    const { title, image, info1, info2, info3, price } = req.body;
    if (!title || !price) return res.status(400).json({ message: 'Название и цена обязательны' });
    try {
        const info = db.prepare(`INSERT INTO cars (title, image, info1, info2, info3, price) VALUES (?, ?, ?, ?, ?, ?)`).run(title, image, info1, info2, info3, price);
        res.status(201).json({ message: 'Автомобиль добавлен', id: info.lastInsertRowid });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateCar = (req, res) => {
    const { title, image, info1, info2, info3, price } = req.body;
    try {
        const info = db.prepare(`UPDATE cars SET title=?, image=?, info1=?, info2=?, info3=?, price=? WHERE id=?`).run(title, image, info1, info2, info3, price, req.params.id);
        if (info.changes === 0) return res.status(404).json({ message: 'Не найден' });
        res.json({ message: 'Обновлён' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteCar = (req, res) => {
    try {
        const info = db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
        if (info.changes === 0) return res.status(404).json({ message: 'Не найден' });
        res.json({ message: 'Удалён' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { addCar, updateCar, deleteCar };