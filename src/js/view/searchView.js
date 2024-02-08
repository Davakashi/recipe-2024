import { elements } from "./base";

// private function
const renderRecipe = (recipe) => {
    const markup = `<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${recipe.title}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
    // ul рүү нэмнэ.
    elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
export const clearSearch = () => {
    elements.searchInput.value = "";
};

export const clearSearchResult = () => {
    elements.searchResultList.innerHTML = "";
    elements.pageButtons.innerHTML = "";
};
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
    // хайлтын үр дүнг хуудаслаж үзүүлэх.
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // хуудаслалтын товчуудийг гаргаж ирэх.
    const totalPages = Math.ceil(recipes.length / resPerPage);
    renderButtons(page, totalPages);
};

// type ====> "prev" or "next"
const createButton = (
    page,
    type,
    direction
) => `<button class="btn-inline results__btn--${type}" data-goto=${page}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${direction}"></use>
                    </svg>
                    <span>Хуудас ${page}</span>
                </button>`;

const renderButtons = (page, totalPages) => {
    let button;

    if (page === 1 && totalPages > 1) {
        // 1-р хуудсан дээр байна, 2-р хуудас гэдэг товчийг дарах ёстой
        button = createButton(2, "next", "right");
    } else if (page < totalPages) {
        // Өмнөх болон дараачийн хуудас руу шилжих товчуудийг гаргана.
        button = createButton(page - 1, "prev", "left");
        button += createButton(page + 1, "next", "right");
    } else if (page === totalPages) {
        // Хамгийн сүүлийн хуудсан дээр байна. Өмнөх рүү шилжүүлэх товчийг харуулна.
        button = createButton(page - 1, "prev", "left");
    }

    elements.pageButtons.insertAdjacentHTML("afterbegin", button);
};
