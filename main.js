const [form] = document.forms;
const categoriesBlock = document.querySelector(".categories_block");
const userTaskCategories =
    JSON.parse(localStorage.getItem("userTaskCategories")) || [];

let categories;
const hiddenCategories =
    JSON.parse(localStorage.getItem("hiddenCategories")) || [];

categoriesBlock.addEventListener("click", (event) =>
    removeElementCategories(event)
);

form.addEventListener("submit", handleAddCategory);

getCategories().then(memorize).then(showCategories);

function getCategories() {
    return fetch("/task-categories.json").then((res) => res.json());
}

function memorize(taskCategories) {
    categories = taskCategories;
}

function showCategories() {
    const taskCategories = [
        ...categories.filter((c) => !hiddenCategories.includes(c)),
        ...userTaskCategories,
    ];

    let categoriesItems = ``;

    taskCategories.forEach((category) => {
        categoriesItems += `<li>${category}<button class="btn_clear">🗑</button></li>`;
    });

    categoriesBlock.innerHTML = categoriesItems;
}

async function handleAddCategory() {
    const userCategory = form.userCategory.value;

    if (
        categories.includes(userCategory) ||
        userTaskCategories.includes(userCategory)
    ) {
        return;
    }

    form.userCategory.value = "";

    userTaskCategories.push(userCategory);
    showCategories();
    localStorage.userTaskCategories = JSON.stringify(userTaskCategories);
}

function removeElementCategories({ target }) {
    if (target.matches("button.btn_clear")) {
        const category = target.previousSibling.textContent;
        if (categories.includes(category)) {
            hiddenCategories.push(category);
            localStorage.hiddenCategories = JSON.stringify(hiddenCategories);
        } else {
            const indexCategory = userTaskCategories.indexOf(category);
            userTaskCategories.splice(indexCategory, 1);
            localStorage.userTaskCategories =
                JSON.stringify(userTaskCategories);
        }
        showCategories();
    }
}
