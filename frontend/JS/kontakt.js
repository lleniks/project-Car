function sendForm() {
    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const subject = document.getElementById('fsubject').value.trim();
    const message = document.getElementById('fmessage').value.trim();
    const msg     = document.getElementById('formMsg');

    if (!name || !email || !subject || !message) {
        msg.textContent = 'Пожалуйста, заполните все поля.';
        msg.className = 'form-msg error';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = 'Введите корректный email.';
        msg.className = 'form-msg error';
        return;
    }

    msg.textContent = ' Сообщение отправлено! Мы свяжемся с вами в ближайшее время.';
    msg.className = 'form-msg success';

    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fsubject').value = '';
    document.getElementById('fmessage').value = '';

    setTimeout(() => { msg.className = 'form-msg'; msg.textContent = ''; }, 5000);
}