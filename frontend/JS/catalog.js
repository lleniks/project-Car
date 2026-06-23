const API_URL = '/api/cars';

const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '../HTML/login.html';
}

async function loadCarsCatalog() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        const data = await response.json();
        renderCards(data);
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('carsContainer').innerHTML =
            `<p class="error-msg">Не удалось загрузить автомобили. Проверьте сервер.</p>`;
    }
}

function renderCards(carsArray) {
    const container = document.getElementById('carsContainer');
    container.innerHTML = '';

    carsArray.forEach(car => {
        const card = document.createElement('div');
        card.classList.add('car-card');
        card.innerHTML = `
            <div class="car-img-wrap">
                <img src="/${car.image}" alt="${car.title}">
                <div class="car-badge">В наличии</div>
            </div>
            <div class="car-info">
                <h3>${car.title}</h3>
                <div class="car-specs">
                    <span>${car.info1 || ''}</span>
                    <span>${car.info2 || ''}</span>
                    <span>${car.info3 || ''}</span>
                </div>
                <div class="card-bottom">
                    <div class="car-price">${car.price}</div>
                    <div class="card-btns">
                        <button class="btn-details" onclick="openDetails(${car.id})">Подробнее</button>
                        <button class="btn-book" onclick="openBooking(${car.id}, '${car.title}', '${car.price}')">Забронировать</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function openDetails(id) {
    try {
        const res = await fetch(`/api/cars/${id}`);
        const car = await res.json();

        document.getElementById('modal-title').textContent = car.title;
        document.getElementById('modal-img').src = '/' + car.image;
        document.getElementById('modal-img').alt = car.title;
        document.getElementById('modal-info').innerHTML = `
            <div class="modal-spec"><span class="spec-label"> Двигатель</span><span>${car.info1 || '—'}</span></div>
            <div class="modal-spec"><span class="spec-label"> Мощность</span><span>${car.info2 || '—'}</span></div>
            <div class="modal-spec"><span class="spec-label"> Привод</span><span>${car.info3 || '—'}</span></div>
            <div class="modal-spec"><span class="spec-label"> Цена</span><span class="modal-price">${car.price}</span></div>
        `;
        document.getElementById('details-modal').classList.add('open');
        document.body.style.overflow = 'hidden';
    } catch(e) {
        console.error(e);
    }
}

function closeDetails() {
    document.getElementById('details-modal').classList.remove('open');
    document.body.style.overflow = '';
}

function openBooking(id, title, price) {
    document.getElementById('booking-car-title').textContent = title;
    document.getElementById('booking-car-price').textContent = price;
    document.getElementById('booking-modal').classList.add('open');
    document.body.style.overflow = 'hidden';

    const today = new Date().toISOString().slice(0, 16);
    document.getElementById('booking-from').min = today;
    document.getElementById('booking-to').min = today;
}

function closeBooking() {
    document.getElementById('booking-modal').classList.remove('open');
    document.body.style.overflow = '';
}

function showBookingMsg(msg, type) {
    const el = document.getElementById('booking-msg');
    el.textContent = msg;
    el.className = 'booking-msg ' + type;
}

document.addEventListener('DOMContentLoaded', () => {
    loadCarsCatalog();

    document.getElementById('headerUser').textContent = currentUser || '';

    document.getElementById('applyFilters').addEventListener('click', async () => {
        const sort = document.getElementById('sortFilter').value;
        const brand = document.getElementById('brandFilter').value;

        let url = '/api/cars';
        if (sort !== 'all') url += `?sortBy=${sort}`;

        try {
            const res = await fetch(url);
            let data = await res.json();

            if (brand !== 'all') {
                data = data.filter(car => car.title.toLowerCase().includes(brand.toLowerCase()));
            }

            renderCards(data);
        } catch(e) {
            console.error(e);
        }
    });

    document.getElementById('details-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDetails();
    });

    document.getElementById('booking-modal').addEventListener('click', function(e) {
        if (e.target === this) closeBooking();
    });

    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name    = document.getElementById('booking-name').value.trim();
        const phone   = document.getElementById('booking-phone').value.trim();
        const address = document.getElementById('booking-address').value.trim();
        const from    = document.getElementById('booking-from').value;
        const to      = document.getElementById('booking-to').value;
        const car     = document.getElementById('booking-car-title').textContent;

        if (new Date(to) <= new Date(from)) {
            showBookingMsg('Дата возврата должна быть позже даты получения', 'error');
            return;
        }

        const days = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
        showBookingMsg(`✅ Бронирование оформлено!\n${car}\nКлиент: ${name}\nТел: ${phone}\nАдрес: ${address}\nСрок: ${days} дн.`, 'success');

        setTimeout(() => {
            closeBooking();
            document.getElementById('booking-form').reset();
        }, 2500);
    });
});