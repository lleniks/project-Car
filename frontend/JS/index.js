function updateHero() {
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) heroTitle.textContent = "Премиальный прокат автомобилей";
    const mainButton = document.querySelector(".hero .btn");
    if (mainButton) mainButton.textContent = "Смотреть автопарк →";
}

function updateLogo() {
    const logo = document.querySelector("#logo");
    if (logo) logo.setAttribute("title", "DriveCar");
}

function updateBannerButton() {
    const bannerButton = document.querySelector(".banner .btn");
    if (bannerButton) bannerButton.classList.add("active-btn");
}

async function renderCars() {
    const carsList = document.querySelector(".cars-list");
    if (!carsList) return;
    carsList.innerHTML = "";

    try {
        const response = await fetch("/api/cars");
        const cars = await response.json();

        cars.forEach(car => {
            const card = document.createElement("article");
            card.classList.add("car-card");
            card.innerHTML = `
                <img src="/${car.image}" alt="${car.title}">
                <div class="card-body">
                    <h3>${car.title}</h3>
                    <p>${car.info1 || ''}</p>
                    <p>${car.info2 || ''}</p>
                    <div class="card-footer">
                        <span class="card-price">${car.price}</span>
                        <div class="card-btns">
                            <button type="button" class="btn-outline" onclick="openCarDetailsModal(${JSON.stringify(car).replace(/"/g, '&quot;')})">Подробнее</button>
                            <button type="button" class="btn-orange" onclick="openBookingModal('${car.title}', '${car.price}')">Забронировать</button>
                        </div>
                    </div>
                </div>
            `;
            carsList.appendChild(card);
        });

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        carsList.innerHTML = "<p style='color:#f87171;text-align:center;padding:20px'>Ошибка загрузки автопарка. Проверьте сервер.</p>";
    }
}

function openCarDetailsModal(car) {
    const modal = document.getElementById("car-details-modal");
    const modalInfo = document.getElementById("modal-car-info");
    if (!modal || !modalInfo) return;

    modalInfo.innerHTML = `
        <img class="modal-car-image" src="/${car.image}" alt="${car.title}">
        <div class="modal-car-body">
            <h2 class="modal-car-title">${car.title}</h2>
            <div class="modal-specs">
                <div class="modal-spec-row"><span class="spec-label"> Двигатель</span><span>${car.info1 || '—'}</span></div>
                <div class="modal-spec-row"><span class="spec-label"> Мощность</span><span>${car.info2 || '—'}</span></div>
                <div class="modal-spec-row"><span class="spec-label"> Привод</span><span>${car.info3 || '—'}</span></div>
            </div>
            <p class="modal-description">
                Испытайте бескомпромиссный уровень комфорта и динамики. Автомобиль предоставляется в идеальном состоянии, с полным баком и премиальным сервисом на весь период аренды.
            </p>
            <div class="modal-footer-row">
                <div>
                    <div class="price-label">Цена в сутки</div>
                    <div class="price-value">${car.price}</div>
                </div>
                <button type="button" class="btn-orange" onclick="closeCarDetailsModal(); openBookingModal('${car.title}', '${car.price}')">Забронировать</button>
            </div>
        </div>
    `;

    modal.showModal();
    setTimeout(() => modal.classList.add("is-open"), 10);
}

function closeCarDetailsModal() {
    const modal = document.getElementById("car-details-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    setTimeout(() => modal.close(), 300);
}

function openBookingModal(title, price) {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'HTML/login.html';
        return;
    }

    let modal = document.getElementById('booking-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'booking-modal';
        modal.className = 'booking-overlay';
        modal.innerHTML = `
            <div class="booking-box">
                <button class="booking-close" onclick="closeBookingModal()">✕</button>
                <div class="booking-head">
                    <h2>Бронирование</h2>
                    <div id="bk-car-name" class="bk-car-name"></div>
                    <div id="bk-car-price" class="bk-car-price"></div>
                </div>
                <form id="booking-form">
                    <div class="bk-group">
                        <label>Ваше имя</label>
                        <input type="text" id="bk-name" placeholder="Иван Иванов" required>
                    </div>
                    <div class="bk-group">
                        <label>Телефон</label>
                        <input type="tel" id="bk-phone" placeholder="+7 777 000 00 00" required>
                    </div>
                    <div class="bk-group">
                        <label>Адрес подачи автомобиля</label>
                        <input type="text" id="bk-address" placeholder="ул. Абая, 1" required>
                    </div>
                    <div class="bk-row">
                        <div class="bk-group">
                            <label>Дата получения</label>
                            <input type="datetime-local" id="bk-from" required>
                        </div>
                        <div class="bk-group">
                            <label>Дата возврата</label>
                            <input type="datetime-local" id="bk-to" required>
                        </div>
                    </div>
                    <div id="bk-msg" class="bk-msg"></div>
                    <button type="submit" class="btn-orange" style="width:100%;padding:14px;font-size:16px;border-radius:12px">Подтвердить бронирование</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const from = document.getElementById('bk-from').value;
            const to   = document.getElementById('bk-to').value;
            const name = document.getElementById('bk-name').value;
            const phone = document.getElementById('bk-phone').value;
            const addr = document.getElementById('bk-address').value;

            if (new Date(to) <= new Date(from)) {
                showBkMsg('Дата возврата должна быть позже даты получения', 'error');
                return;
            }
            const days = Math.ceil((new Date(to) - new Date(from)) / 86400000);
            showBkMsg(` Бронирование оформлено!\nАвто: ${document.getElementById('bk-car-name').textContent}\nКлиент: ${name} | Тел: ${phone}\nАдрес: ${addr}\nСрок: ${days} дн.`, 'success');
            setTimeout(() => { closeBookingModal(); this.reset(); }, 2500);
        });

        modal.addEventListener('click', function(e) {
            if (e.target === this) closeBookingModal();
        });
    }

    document.getElementById('bk-car-name').textContent = title;
    document.getElementById('bk-car-price').textContent = price;
    const today = new Date().toISOString().slice(0, 16);
    document.getElementById('bk-from').min = today;
    document.getElementById('bk-to').min = today;
    document.getElementById('bk-msg').className = 'bk-msg';
    document.getElementById('bk-msg').textContent = '';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

function showBkMsg(msg, type) {
    const el = document.getElementById('bk-msg');
    el.textContent = msg;
    el.className = 'bk-msg ' + type;
}

const style = document.createElement('style');
style.textContent = `
.card-body { padding: 15px; display: flex; flex-direction: column; gap: 8px; }
.card-footer { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.card-price { font-size: 20px; font-weight: 700; color: #ca7e40; }
.card-btns { display: flex; gap: 8px; }
.btn-outline { flex:1; padding: 10px; border: 1px solid #ca7e40; border-radius: 10px; background: transparent; color: #ca7e40; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-outline:hover { background: #ca7e40; color: #fff; }
.btn-orange { flex:1; padding: 10px; border: none; border-radius: 10px; background: #ca7e40; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-orange:hover { background: #df9550; }

.modal-car-image { width:100%; height:260px; object-fit:cover; border-radius:16px 16px 0 0; display:block; }
.modal-car-body { padding: 24px; }
.modal-car-title { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
.modal-specs { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; }
.modal-spec-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #333; font-size: 14px; color: #ccc; }
.spec-label { color: #888; }
.modal-description { font-size: 14px; color: #999; line-height: 1.6; margin-bottom: 20px; }
.modal-footer-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.price-label { font-size: 12px; color: #888; text-transform: uppercase; }
.price-value { font-size: 22px; font-weight: 700; color: #ca7e40; }

.booking-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:2000; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
.booking-overlay[style*="flex"] { display:flex !important; }
.booking-box { background:#1a1a1a; border-radius:20px; border:1px solid #2a2a2a; max-width:560px; width:100%; max-height:90vh; overflow-y:auto; padding:32px; position:relative; animation: fadeUp 0.25s ease; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.booking-close { position:absolute; top:16px; right:16px; background:#222; border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-size:15px; cursor:pointer; }
.booking-close:hover { background:#ca7e40; }
.booking-head { margin-bottom:24px; }
.booking-head h2 { font-size:22px; font-weight:700; margin-bottom:6px; }
.bk-car-name { font-size:15px; color:#ccc; }
.bk-car-price { font-size:20px; font-weight:700; color:#ca7e40; margin-top:4px; }
.bk-group { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.bk-group label { font-size:12px; color:#888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600; }
.bk-group input { background:#111; border:1px solid #2a2a2a; border-radius:10px; color:#fff; font-size:14px; padding:11px 14px; outline:none; transition:border-color 0.2s; }
.bk-group input:focus { border-color:#ca7e40; }
.bk-group input::placeholder { color:#555; }
.bk-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.bk-msg { border-radius:10px; font-size:13px; margin-bottom:14px; white-space:pre-line; line-height:1.6; }
.bk-msg.success { padding:12px; background:#14231a; color:#4ade80; border:1px solid #4ade8044; }
.bk-msg.error   { padding:12px; background:#2a1414; color:#f87171; border:1px solid #f8717144; }

.premium-modal { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:20px; padding:0; max-width:580px; width:90%; color:#fff; overflow:hidden; }
.premium-modal::backdrop { background:rgba(0,0,0,0.75); backdrop-filter:blur(4px); }
.modal-wrapper { position:relative; }
.close-modal-btn { position:absolute; top:14px; right:14px; background:#222; border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-size:20px; cursor:pointer; z-index:10; }
.close-modal-btn:hover { background:#ca7e40; }
`;
document.head.appendChild(style);

function setupModal() {
    const closeBtn = document.getElementById("close-details-btn");
    const modal = document.getElementById("car-details-modal");
    if (closeBtn) closeBtn.addEventListener("click", closeCarDetailsModal);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeCarDetailsModal(); });
}

function setupKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const modal = document.getElementById("car-details-modal");
            if (modal && modal.open) { e.preventDefault(); closeCarDetailsModal(); }
            closeBookingModal();
        }
    });
}

function initPage() {
    updateHero();
    updateLogo();
    updateBannerButton();
    renderCars();
    setupModal();
    setupKeyboardEvents();
    setupBurger();
}

function setupBurger() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        menu.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            menu.classList.remove('active');
        });
    });
}
initPage();