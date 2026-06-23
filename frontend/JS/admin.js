const API = 'http://localhost:3000/api';
let token = localStorage.getItem('adminToken');

async function doLogin() {
    const login = document.getElementById('adminLogin').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    try {
        const res = await fetch(`${API}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        const data = await res.json();

        if (!res.ok) {
            document.getElementById('loginError').textContent = data.message;
            return;
        }

        token = data.token;
        localStorage.setItem('adminToken', token);
        showPanel();
    } catch {
        document.getElementById('loginError').textContent = 'Сервер недоступен';
    }
}

function doLogout() {
    localStorage.removeItem('adminToken');
    token = null;
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

function showPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadCars();
}

if (token) showPanel();

async function loadCars() {
    const res = await fetch(`${API}/cars`);
    const cars = await res.json();
    renderTable(cars);
}

function renderTable(cars) {
    const tbody = document.getElementById('carsTableBody');
    tbody.innerHTML = '';

    cars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${car.id}</td>
            <td><img class="car-img-preview" src="../${car.image}" alt="" onerror="this.style.opacity=0.2"></td>
            <td>${car.title}</td>
            <td>${car.info1 || '—'}</td>
            <td>${car.info2 || '—'}</td>
            <td>${car.info3 || '—'}</td>
            <td>${car.price}</td>
            <td>
                <button class="btn-edit" onclick="openModal(${JSON.stringify(car).replace(/"/g, '&quot;')})">Изменить</button>
                <button class="btn-delete" onclick="deleteCar(${car.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(car = null) {
    document.getElementById('carId').value = car ? car.id : '';
    document.getElementById('carTitle').value = car ? car.title : '';
    document.getElementById('carImage').value = car ? car.image : '';
    document.getElementById('carInfo1').value = car ? (car.info1 || '') : '';
    document.getElementById('carInfo2').value = car ? (car.info2 || '') : '';
    document.getElementById('carInfo3').value = car ? (car.info3 || '') : '';
    document.getElementById('carPrice').value = car ? car.price : '';
    document.getElementById('modalTitle').textContent = car ? 'Редактировать автомобиль' : 'Добавить автомобиль';
    document.getElementById('carModal').classList.add('open');
}

function closeModal() {
    document.getElementById('carModal').classList.remove('open');
}

async function saveCar() {
    const id = document.getElementById('carId').value;
    const body = {
        title: document.getElementById('carTitle').value,
        image: document.getElementById('carImage').value,
        info1: document.getElementById('carInfo1').value,
        info2: document.getElementById('carInfo2').value,
        info3: document.getElementById('carInfo3').value,
        price: document.getElementById('carPrice').value,
    };

    const url = id ? `${API}/admin/cars/${id}` : `${API}/admin/cars`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        showToast(id ? 'Автомобиль обновлён' : 'Автомобиль добавлен');
        closeModal();
        loadCars();
    } else {
        const data = await res.json();
        showToast(data.message || 'Ошибка', true);
    }
}

async function deleteCar(id) {
    if (!confirm('Удалить этот автомобиль?')) return;

    const res = await fetch(`${API}/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
        showToast('Автомобиль удалён');
        loadCars();
    } else {
        showToast('Ошибка удаления', true);
    }
}

function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '') + ' show';
    setTimeout(() => t.classList.remove('show'), 3000);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
        doLogin();
    }
});
