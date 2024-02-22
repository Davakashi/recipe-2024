require("@babel/polyfill");
import Search from "./model/search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/recipe";
import {
    renderRecipe,
    clearRecipe,
    highlightSelectorRecipe,
} from "./view/recipeView";
import list from "./model/list";
import * as listView from "./view/listView";

/**
 *  Web app төлөв
 *  - Хайлтын query, үр дүн
 *  - Тухайн үзүүлж байгаа жор
 *  - Лайкалсан жорууд
 *  - Захиалж байгаа жорын найрлагууд
 */

const state = {};

const controlSearch = async () => {
    // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж ирнэ
    const query = searchView.getInput();

    if (query) {
        // 2) Шинээр хайлтын обектийг үүсгэж өгнө.
        state.search = new Search(query);

        // 3) Хайлт хийхэд зориулж дэлгэцийг бэлтгэнэ.
        searchView.clearSearch();
        searchView.clearSearchResult();
        renderLoader(elements.searchResultDiv);
        // 4) хайлтыг гүйцэтгэнэ.
        await state.search.doSearch();
        // 5) Хайлтын үр дүнг дэлгэцэнд гүйцэтгэнэ.
        clearLoader();
        if (state.search.result === undefined) alert("Хайлт илэрцгүй");
        else searchView.renderRecipes(state.search.result);
    }
};

elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-inline");

    if (btn) {
        const gotoPageNumber = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchResult();
        searchView.renderRecipes(state.search.result, gotoPageNumber);
    }
});

/**
 * Жорын контроллер
 */

const controlRecipe = async () => {
    // 1) URL - с ID-г салгаж авна.
    const id = window.location.hash.replace("#", "");

    // URL дээр ID байгаа эсэхийг шалгана
    if (id) {
        // 2) Жорын моделийг үүсгэнэ.
        state.recipe = new Recipe(id);

        // 3) UI дэлгэцийг бэлтгэнэ.
        clearRecipe();
        renderLoader(elements.recipeDiv);
        highlightSelectorRecipe(id);
        // 4) Жороо татаж авчирна.
        await state.recipe.getRecipe();
        // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно.
        clearLoader();
        state.recipe.calcTime();
        state.recipe.calcHuniiToo();
        // 6) Жороо дэлгэцэнд гаргана.
        renderRecipe(state.recipe);
    }
};

["hashchange", "load"].forEach((event) =>
    window.addEventListener(event, controlRecipe)
);

/**
 * Найрлаганы контроллер
 */

const controlList = () => {
    // Найрлаганы моделийг үүсгэнэ.
    state.list = new list();
    listView.clearItems();

    // Уг модель рүү бүх найрлагыг авч хийнэ.
    state.recipe.ingredients.forEach((n) => {
        state.list.additem(n);
        listView.renderItem(n);
    });
};

elements.recipeDiv.addEventListener("click", (e) => {
    if (e.target.matches(".recipe__btn, .recipe__btn *")) controlList();
});
