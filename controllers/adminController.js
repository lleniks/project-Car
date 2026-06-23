const db = require('../database/db');

const addCar = (req, res) => {
    const { title, image, info1, info2, info3, price } = req.body;
    if (!title || !price) return res.status(400).json({ message: 'Название и цена обязательны' });

    db.run(`INSERT INTO cars (title, image, info1, info2, info3, price) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, image, info1, info2, info3, price], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Автомобиль добавлен', id: this.lastID });
        });
};

const updateCar = (req, res) => {
    const { id } = req.params;
    const { title, image, info1, info2, info3, price } = req.body;

    db.run(`UPDATE cars SET title=?, image=?, info1=?, info2=?, info3=?, price=? WHERE id=?`,
        [title, image, info1, info2, info3, price, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Автомобиль не найден' });
            res.json({ message: 'Автомобиль обновлён' });
        });
};

const deleteCar = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM cars WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Автомобиль не найден' });
        res.json({ message: 'Автомобиль удалён' });
    });
};

module.exports = { addCar, updateCar, deleteCar };