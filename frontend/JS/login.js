const registerForm = document.getElementById("registerForm");
localStorage.removeItem("currentUser");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name     = document.getElementById("regName").value.trim();
        const email    = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;

        if (!name || !email || !password) {
            showStatus("Заполните все поля.", "error");
            return;
        }

        setLoading(true, "registerBtn", "Регистрация...");

        try {
            const response = await fetch("/api/users/register", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showStatus(data.message, "success");
                registerForm.reset();
            } else {
                showStatus(data.message || "Ошибка регистрации.", "error");
            }
        } catch (err) {
            showStatus("Нет соединения с сервером.", "error");
            console.error(err);
        } finally {
            setLoading(false, "registerBtn", "Зарегистрироваться");
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email    = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        setLoading(true, "loginBtn", "Проверка...");

        try {
            const response = await fetch("/api/users/login", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("currentUser", data.user.name);

                showStatus(`Вход выполнен! Привет, ${data.user.name}!`, "success");
                showUser();

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1000);
            } else {
                showStatus(data.message || "Неверный email или пароль.", "error");
            }
        } catch (err) {
            showStatus("Нет соединения с сервером.", "error");
            console.error(err);
        } finally {
            setLoading(false, "loginBtn", "Войти");
        }
    });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("currentUser");
        showStatus("Вы вышли из аккаунта.", "success");
        showUser();

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 800);
    });
}

function showUser() {
    const status      = document.getElementById("userStatus");
    const currentUser = sessionStorage.getItem("currentUser");

    if (currentUser) {
        status.textContent = `Вы вошли как: ${currentUser}`;
        status.style.color = "#93c5fd";
    } else {
        status.textContent = "Пользователь не авторизован";
        status.style.color = "#9ca3af";
    }
}

function showStatus(message, type) {
    const el = document.getElementById("userStatus");
    el.textContent = message;
    el.style.color = type === "success" ? "#4ade80" : "#f87171";
}

function setLoading(isLoading, btnId, text) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled    = isLoading;
    btn.textContent = text;
}

showUser();
