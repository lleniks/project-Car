const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
if (!user) {
    window.location.href = '../HTML/login.html';
} else {
    document.getElementById('userName').textContent = user;
}

const savedCard = localStorage.getItem('userCard');
if (savedCard) {
    document.getElementById('cardDisplay').textContent = maskCard(savedCard);
    document.getElementById('cardDisplay').classList.remove('empty');
}

const savedAvatar = localStorage.getItem('userAvatar');
if (savedAvatar) {
    document.getElementById('avatarDisplay').innerHTML = `<img src="${savedAvatar}">`;
}

function formatCard(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function maskCard(num) {
    const digits = num.replace(/\s/g, '');
    return digits.substring(0, 4) + ' **** **** ' + digits.substring(12);
}

function saveCard() {
    const val = document.getElementById('cardInput').value.replace(/\s/g, '');
    if (val.length < 16) { showToast('Введите корректный номер карты (16 цифр)'); return; }
    localStorage.setItem('userCard', val);
    document.getElementById('cardDisplay').innerHTML = maskCard(val);
    document.getElementById('cardDisplay').className = 'card-number-display';
    document.getElementById('cardInput').value = '';
    showToast(' Карта успешно привязана');
}

function changeAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const src = ev.target.result;
        localStorage.setItem('userAvatar', src);
        document.getElementById('avatarDisplay').innerHTML = `<img src="${src}">`;
        showToast(' Фото обновлено');
    };
    reader.readAsDataURL(file);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
