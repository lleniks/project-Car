const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        const user = { name,email,password};

        localStorage.setItem("user", JSON.stringify(user));
        alert("Регистрация успешна!");
        registerForm.reset();

    });

}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (
            savedUser &&
            savedUser.email === email &&
            savedUser.password === password
        ) {

            localStorage.setItem("isAuth", "true");

            localStorage.setItem("currentUser", savedUser.name);

            alert("Вход выполнен!");
            showUser();
            window.location.href = "../index.html";

        } else {

            alert("Неверный email или пароль");
        }
    });
}

function showUser() {

    const status = document.getElementById("userStatus");
    const isAuth = localStorage.getItem("isAuth");
    const currentUser = localStorage.getItem("currentUser");
    if (isAuth === "true") {
        status.textContent = `Вы вошли как: ${currentUser}`;
    } else {
        status.textContent = "Пользователь не авторизован";

    }

}

showUser();

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("isAuth");

        localStorage.removeItem("currentUser");

        alert("Вы вышли из акаунта!");
        showUser();
        window.location.href = "../index.html";
    });

}