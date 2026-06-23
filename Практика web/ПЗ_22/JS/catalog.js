document.addEventListener('DOMContentLoaded', () => {
    const carsData = [
        {
            brand: 'BMW',
            model: 'BMW 5 Series',
            year: '2023',
            color: 'gray',
            colorText: 'Cерый',
            price: '15 500',
            image: '../Image/Без названия (8).jfif'
        },

        {
            brand: 'Mercedes',
            model: 'Mercedes E-Class',
            year: '2024',
            color: 'black',
            colorText: 'Черный',
            price: '8 500',
            image: '../Image/мерседес.jfif'
        },

        {
            brand: 'Porsche',
            model: 'Porsche 911',
            year: '2023',
            color: 'gray',
            colorText: 'Серый',
            price: '15 000',
            image: '../Image/911.jfif'
        },

        {
            brand: 'Range Rover',
            model: 'Range Rover Vogue',
            year: '2022',
            color: 'black',
            colorText: 'Черный',
            price: '12 000',
            image: '../Image/ланж.jfif'
        },

        {
            brand: 'Audi',
            model: 'Audi A6',
            year: '2023',
            color: 'white',
            colorText: 'Белый',
            price: '20 500' ,
            image: '../Image/ауди.jfif'
        },

        {
            brand: 'Mazda',
            model: 'Mazda CX-5',
            year: '2023',
            color: 'red',
            colorText: 'красный',
            price: '10 500' ,
            image: '../Image/мазда.jfif'
        },

        {
            brand: 'Chevrolet',
            model: 'Chevrolet Cruze',
            year: '2012',
            color: 'black',
            colorText: 'черный',
            price: '10 500' ,
            image: '../Image/сневролет.jfif'
        },

        {
            brand: 'Dodge',
            model: 'Dodge Demon',
            year: '2018',
            color: 'black',
            colorText: 'черный',
            price: '12 500' ,
            image: '../Image/додж.jpg'
        },

        {
            brand: 'Hyundai',
            model: 'Hyundai Auto Asia',
            year: '2012',
            color: 'black',
            colorText: 'черный',
            price: '10 500' ,
            image: '../Image/хендай.jpg'
        },
    ];

    const brandFilter = document.getElementById('brandFilter');
    const yearFilter = document.getElementById('yearFilter');
    const colorFilter = document.getElementById('colorFilter');
    const applyButton = document.getElementById('applyFilters');

    const carsContainer = document.getElementById('carsContainer');

    function renderCars(cars) {

        carsContainer.innerHTML = '';

        cars.forEach(car => {

            carsContainer.innerHTML += `
                <div class="car-card">
                    <img src="${car.image}" alt="${car.model}">

                    <div class="car-info">
                        <h3>${car.model}</h3>

                        <p>
                            ${car.year} • ${car.colorText}
                        </p>

                        <span>
                            от ${car.price} тг / сутки
                        </span>

                        <button>Выбрать</button>
                    </div>
                </div>
            `;
        });
    }

    function filterCars() {

        const brandValue = brandFilter.value;
        const yearValue = yearFilter.value;
        const colorValue = colorFilter.value;

        const filteredCars = carsData.filter(car => {

            const brandMatch =
                brandValue === 'all' ||
                car.brand === brandValue;

            const yearMatch =
                yearValue === 'all' ||
                car.year === yearValue;

            const colorMatch =
                colorValue === 'all' ||
                car.color === colorValue;

            return brandMatch && yearMatch && colorMatch;
        });

        renderCars(filteredCars);
    }

    renderCars(carsData);

    applyButton.addEventListener('click', filterCars);

});

document.addEventListener('DOMContentLoaded', () => {

    const brandFilter = document.getElementById('brandFilter');
    const yearFilter = document.getElementById('yearFilter');
    const colorFilter = document.getElementById('colorFilter');
    const applyButton = document.getElementById('applyFilters');

    const cars = document.querySelectorAll('.car-card');

    function filterCars() {

        const brandValue = brandFilter.value;
        const yearValue = yearFilter.value;
        const colorValue = colorFilter.value;

        cars.forEach(car => {

            const brand = car.dataset.brand;
            const year = car.dataset.year;
            const color = car.dataset.color;

            const brandMatch =
                brandValue === 'all' || brand === brandValue;

            const yearMatch =
                yearValue === 'all' || year === yearValue;

            const colorMatch =
                colorValue === 'all' || color === colorValue;

            if (brandMatch && yearMatch && colorMatch) {
                car.style.display = 'block';
            } else {
                car.style.display = 'none';
            }
        });
    }

    applyButton.addEventListener('click', filterCars);

});