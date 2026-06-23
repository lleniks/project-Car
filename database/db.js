const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, 'project.db'));

db.exec(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT, image TEXT,
    info1 TEXT, info2 TEXT, info3 TEXT, price TEXT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
)`);

const count = db.prepare('SELECT COUNT(*) as count FROM cars').get();
if (count.count === 0) {
    const stmt = db.prepare(`INSERT INTO cars (title, image, info1, info2, info3, price) VALUES (?, ?, ?, ?, ?, ?)`);
    const insert = db.transaction((cars) => { cars.forEach(car => stmt.run(car)); });
    insert([
        ["BMW M5 Competition", "Image/Без названия (8).jfif", "Двигатель: 4.4L V8 Битурбо (2011)", "Мощность: 560 л.с. / Механика", "Привод: Задний / 5 мест", "20 000 тг/сутки"],
        ["Land Rover Range Rover Vogue", "Image/ланж.jfif", "Двигатель: 2.0L Турбо (2022)", "Мощность: 300 л.с. / Автомат", "Привод: Полный / 5 мест", "20 000 тг/сутки"],
        ["Fiat Albea", "Image/фиат.WEBP", "Двигатель: 1.6L Атмосферный (2012)", "Мощность: 103 л.с. / Механика", "Привод: Передний / 5 мест", "20 000 тг/сутки"],
        ["Audi RS6 Avant / A6 S-Line", "Image/ауди.jfif", "Двигатель: 4.0L V8 TFSI / 2.0L TFSI (2023)", "Мощность: 600 л.с. / Автомат", "Тип кузова: Спортивный универсал / Седан", "40 000 тг/сутки"],
        ["Mazda CX-5 SkyActiv", "Image/мазда.jfif", "Двигатель: 2.0L SkyActiv-G (2023)", "Мощность: 150 л.с. / Механика", "Привод: Передний / 5 мест", "10 000 тг/сутки"],
        ["Chevrolet Cruze", "Image/сневролет.jfif", "Двигатель: 1.8L Ecotec (2012)", "Мощность: 141 л.с. / Автомат", "Привод: Передний / 5 мест", "10 000 тг/сутки"],
        ["Dodge Challenger SRT Demon", "Image/додж.jpg", "Двигатель: 6.2L V8 Supercharged (2018)", "Мощность: 840 л.с. / Механика", "Привод: Задний / 5 мест", "20 000 тг/сутки"],
        ["Porsche 911 Carrera GTS", "Image/911.jfif", "Двигатель: 3.0L Твин-турбо (2012)", "Мощность: 480 л.с. / Автомат", "Разгон 0-100 км/ч: 3.4 сек / 4 места", "45 000 тг/сутки"],
        ["Mercedes-Benz G-Class AMG 63", "Image/мерседес.jfif", "Двигатель: 4.0L V8 Битурбо (2026)", "Мощность: 585 л.с.", "Коробка: Автомат (9 ступеней) / 5 мест", "55 000 тг/сутки"],
        ["Hyundai Auto Asia (Sonata/Tucson)", "Image/хендай.jpg", "Двигатель: 2.0L MPI (2012)", "Мощность: 150 л.с. / Автомат", "Привод: Передний / 5 мест", "79 500 тг/сутки"],
        ["Jetour Dashing I", "Image/китай.jpg", "Двигатель: 1.5L Турбо (2024)", "Мощность: 147 л.с. / Автомат (Робот)", "Привод: Передний / 5 мест", "10 500 тг/сутки"]
    ]);
}

console.log(' База данных подключена');
module.exports = db;