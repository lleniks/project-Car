function updateHero() {
    const heroTitle = document.querySelector(".hero h1");

    if (heroTitle) {
        heroTitle.textContent = "Премиальный прокат автомобилей";
    }

    const mainButton = document.querySelector(".hero .btn");

    if (mainButton) {
        mainButton.textContent = "Смотреть автопарк →";
    }
}

function updateLogo() {
    const logo = document.querySelector("#logo");

    if (logo) {
        logo.setAttribute("title", "DriveCar");
    }
}

function updateBannerButton() {
    const bannerButton = document.querySelector(".banner .btn");

    if (bannerButton) {
        bannerButton.classList.add("active-btn");
    }
}

function updateCarTitles() {
    const carTitles = document.querySelectorAll(".car-card h3");

    carTitles.forEach(title => {
        title.classList.add("car-title");
    });
}

function renderCars() {

    const carsList = document.querySelector(".cars-list");

    if (!carsList) return;

    carsList.innerHTML = "";

    const cars = [

        {
            image: "Image/Без названия (8).jfif",
            title: "BMW M5",
            info1: "2011, Механика, Бензин",
            info2: "5 мест",
            info3: "2.0л",
            price: "От 20000 тг/сутки"
        },

        {
            image: "Image/ланж.jfif",
            title: "Land Rover",
            info1: "2022, Автомат, Бензин",
            info2: "5 мест",
            info3: "2.0л",
            price: "От 20000 тг/сутки"
        },

        {
            image: "Image/фиат.WEBP",
            title: "Fiat Albea",
            info1: "2012, Механика, Бензин",
            info2: "5 мест",
            info3: "1.6л",
            price: "От 20000 тг/сутки"
        },

        {
            image: "Image/ауди.jfif",
            title: "Audi A6",
            info1: "2023, Автомат, Бензин",
            info2: "5 мест",
            info3: "2.0л",
            price: "От 20500 тг/сутки"
        },

        {
            image: "Image/мазда.jfif",
            title: "Mazda CX-5",
            info1: "2023, Механика, Бензин",
            info2: "5 мест",
            info3: "2.0л",
            price: "От 10000 тг/сутки"
        },

        {
            image: "Image/сневролет.jfif",
            title: "Chevrolet Cruze",
            info1: "2012, Автомат, Бензин",
            info2: "5 мест",
            info3: "1.8л",
            price: "От 100000 тг/сутки"
        },

        {
            image: "Image/додж.jpg",
            title: "Dodge Demon",
            info1: "2018, Механика, Бензин",
            info2: "5 мест",
            info3: "6.2л",
            price: "От 20000 тг/сутки"
        },

        {
            image: "Image/911.jfif",
            title: "Porsche 911",
            info1: "2012, Автомат, Бензин",
            info2: "4 места",
            info3: "3.0л",
            price: "От 70500 тг/сутки"
        },

        {
            image: "Image/мерседес.jfif",
            title: "Mercedes-Benz S",
            info1: "2026, Автомат, Бензин",
            info2: "5 мест",
            info3: "3.0л",
            price: "От 60500 тг/сутки"
        },

        {
            image: "Image/хендай.jpg",
            title: "Hyundai Auto Asia",
            info1: "2012, Автомат, Бензин",
            info2: "5 мест",
            info3: "2.0л",
            price: "От 79500 тг/сутки"
        },

        {
            image: "Image/китай.jpg",
            title: "Jetour Dashing I",
            info1: "2024, Автомат, Бензин",
            info2: "5 мест",
            info3: "1.5л",
            price: "От 10500 тг/сутки"
        }

    ];



    cars.forEach(car => {

        const newCar = document.createElement("article");

        newCar.classList.add("car-card");

        newCar.innerHTML = `
            <img src="${car.image}">

            <h3>${car.title}</h3>

            <p>${car.info1}</p>
            <p>${car.info2}</p>
            <p>${car.info3}</p>
            <p>${car.price}</p>

            <button type="button">Подробнее</button>
        `;
        carsList.append(newCar);
    });

}

renderCars();
function addStats() {

    const stats = document.querySelector(".stats");
    if (!stats) return;
    const newStat = document.createElement("div");
    newStat.classList.add("stat-box");
    newStat.innerHTML = `<h2>15+</h2><p>Лет опыта в аренде автомобилей</p>`;
    stats.append(newStat);
}

function activateAbout() {
    const aboutSection = document.querySelector(".about");
    if (aboutSection) {
        aboutSection.classList.add("about-active");
    }
}

function setupBurgerMenu() {

    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");
    if (!burger || !menu) return;
    burger.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
        if (!burger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("active");
        }

    });

}

function setupModal() {

    const openButtons = document.querySelectorAll(".open-modal");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    openButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            modals[index].showModal();
        });

    });

    closeButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            modals[index].close();
        });

    });

}

function setupKeyboardEvents() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const modals = document.querySelectorAll(".modal");
            modals.forEach(modal => {
                modal.close();
            });

        }

    });

}

function setupSubmit() {
    const form = document.getElementById("searchForm");
    if (!form) return;
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Форма успешно отправлена!");

    });

}

function setupHoverEffects() {
    const cards = document.querySelectorAll(".car-card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.03)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });
    });

}

function initPage() {
    updateHero();
    updateLogo();
    updateBannerButton();
    updateCarTitles();
    addCarCard();
    addStats();
    activateAbout();

    setupBurgerMenu();
    setupTheme();
    setupModal();
    setupKeyboardEvents();
    setupSubmit();
    setupHoverEffects();
}
initPage();
