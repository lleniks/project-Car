const cars = [
    {
        id: 1,
        title: "BMW M5 Competition",
        image: "Image/Без названия (8).jfif",
        info1: "Двигатель: 4.4L V8 Битурбо (2011)",
        info2: "Мощность: 560 л.с. / Механика",
        info3: "Привод: Задний / 5 мест",
        price: "20 000 тг / сутки"
    },
    {
        id: 2,
        title: "Land Rover Range Rover Vogue",
        image: "Image/ланж.jfif",
        info1: "Двигатель: 2.0L Турбо (2022)",
        info2: "Мощность: 300 л.с. / Автомат",
        info3: "Привод: Полный / 5 мест",
        price: "20 000 тг / сутки"
    },
    {
        id: 3,
        title: "Fiat Albea",
        image: "Image/фиат.WEBP",
        info1: "Двигатель: 1.6L Атмосферный (2012)",
        info2: "Мощность: 103 л.с. / Механика",
        info3: "Привод: Передний / 5 мест",
        price: "20 000 тг / сутки"
    },
    {
        id: 4,
        title: "Audi RS6 Avant / A6 S-Line",
        image: "Image/ауди.jfif",
        info1: "Двигатель: 4.0L V8 TFSI / 2.0L TFSI (2023)",
        info2: "Мощность: 600 л.с. / Автомат",
        info3: "Тип кузова: Спортивный универсал / Седан",
        price: "40 000 тг / сутки"
    },
    {
        id: 5,
        title: "Mazda CX-5 SkyActiv",
        image: "Image/мазда.jfif",
        info1: "Двигатель: 2.0L SkyActiv-G (2023)",
        info2: "Мощность: 150 л.с. / Механика",
        info3: "Привод: Передний / 5 мест",
        price: "10 000 тг / сутки"
    },
    {
        id: 6,
        title: "Chevrolet Cruze",
        image: "Image/сневролет.jfif",
        info1: "Двигатель: 1.8L Ecotec (2012)",
        info2: "Мощность: 141 л.с. / Автомат",
        info3: "Привод: Передний / 5 мест",
        price: "100 000 тг / сутки"
    },
    {
        id: 7,
        title: "Dodge Challenger SRT Demon",
        image: "Image/додж.jpg",
        info1: "Двигатель: 6.2L V8 Supercharged (2018)",
        info2: "Мощность: 840 л.с. / Механика",
        info3: "Привод: Задний / 5 мест",
        price: "20 000 тг / сутки"
    },
    {
        id: 8,
        title: "Porsche 911 Carrera GTS",
        image: "Image/911.jfif", 
        info1: "Двигатель: 3.0L Твин-турбо (2012)",
        info2: "Мощность: 480 л.с. / Автомат",
        info3: "Разгон 0-100 км/ч: 3.4 сек / 4 места",
        price: "45 000 тг / сутки"
    },
    {
        id: 9,
        title: "Mercedes-Benz G-Class AMG 63",
        image: "Image/мерседес.jfif",
        info1: "Двигатель: 4.0L V8 Битурбо (2026)",
        info2: "Мощность: 585 л.с.",
        info3: "Коробка: Автомат (9 ступеней) / 5 мест",
        price: "55 000 тг / сутки"
    },
    {
        id: 10,
        title: "Hyundai Auto Asia (Sonata/Tucson)",
        image: "Image/хендай.jpg",
        info1: "Двигатель: 2.0L MPI (2012)",
        info2: "Мощность: 150 л.с. / Автомат",
        info3: "Привод: Передний / 5 мест",
        price: "79 500 тг / сутки"
    },
    {
        id: 11,
        title: "Jetour Dashing I",
        image: "Image/китай.jpg",
        info1: "Двигатель: 1.5L Турбо (2024)",
        info2: "Мощность: 147 л.с. / Автомат (Робот)",
        info3: "Привод: Передний / 5 мест",
        price: "10 500 тг / сутки"
    }
];

const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
};

const checkApi = (req, res) => {
    res.json({ message: "API is working" });
};

const getProducts = (req, res) => {
    try {
        const { search, sortBy, limit } = req.query;
        let result = [...cars];

        if (search) {
            result = result.filter(car => 
                car.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy === 'price_asc') {
            result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        } else if (sortBy === 'price_desc') {
            result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        }

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber > 0) {
                result = result.slice(0, limitNumber);
            }
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const getProductById = (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const car = cars.find(c => c.id === id);

        if (!car) {
            return res.status(404).json({ message: `Автомобиль с ID ${id} не найден` });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = {
    checkApi,
    getProducts,
    getProductById
};