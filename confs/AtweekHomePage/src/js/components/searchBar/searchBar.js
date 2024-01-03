const searchBarForm = document.querySelector('#search-bar');
const changeBrowserBtn = searchBarForm.querySelector("#change-browser-btn");
const searchBarFormInput = searchBarForm.querySelector('#search-bar-input');
const searchSuggestsContainer = document.querySelector(".search-suggests");
const searchSuggestsList = searchSuggestsContainer.getElementsByTagName("li");
const addNewLink = document.querySelector("#add-new-link-btn");

let suggests = new Array();
let activeSuggestIndex = -1;

const searchHistoryLocalStorageKey = "search-history";
const maxSearchHistoryItems = 10;
const searchHistory = getSearchHistory();

const browsers = [
    {
        "name": "Google Chrome",
        "searchUrl": "http://www.google.com/search?q=",
        "iconSrc": "./svg/google-chrome.svg"
    },
    {
        "name": "DuckDuckGo",
        "searchUrl": "https://duckduckgo.com/?q=",
        "iconSrc": "./svg/duck-duck-go.svg"
    }
]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

window.onload = evt => {
    const preferBrowser = getPreferBrowser();

    changeBrowserBtn.src = preferBrowser.iconSrc;
    changeBrowserBtn.setAttribute("browser", preferBrowser.name);
}

changeBrowserBtn.addEventListener("click", evt => {
    const preferBrowser = getPreferBrowser();

    let currentBrowserIndex = browsers.indexOf(preferBrowser);
    currentBrowserIndex++;

    if (currentBrowserIndex >= browsers.length) {
        currentBrowserIndex = 0;
    }

    setPreferBrowser(currentBrowserIndex);
    const newPreferBrowser = getPreferBrowser();

    changeBrowserBtn.src = newPreferBrowser.iconSrc;
    changeBrowserBtn.setAttribute("browser", newPreferBrowser.name);
})


// поиск
searchBarForm.addEventListener("submit", OnSubmitSearchBar);

function OnSubmitSearchBar(evt) {
    evt.preventDefault();

    const searchBarFormInputValue = searchBarFormInput.value.trim();
    if (searchBarFormInputValue === '')
        return;

    addInSearchHistory(searchBarFormInputValue);
    location.href = getRedirectUrlFromQueryWords(searchBarFormInputValue);
}

searchBarFormInput.addEventListener("input", async evt => {
    // http://google.com/complete/search?client=chrome&q=
    const inputValue = evt.target.value.trim();

    if (inputValue !== "") {
        updateNodeSuggest(0, inputValue);
        setActiveSuggest(0, false);
        activeSuggestIndex = 0;
    }
    else {
        removeFocusFromSuggest(0);
        activeSuggestIndex = -1;
    }

    // const proxy = "https://corsproxy.io/?";
    // const googleSuggestUrl = "http://suggestqueries.google.com/complete/search?client=chrome&q=";
    // const queryUrl = proxy + encodeURIComponent(googleSuggestUrl + inputValue);

    // const response = await fetch(queryUrl);

    const googleSuggestUrl = "http://suggestqueries.google.com/complete/search?client=chrome&q=";
    const queryUrl = googleSuggestUrl + encodeURIComponent(inputValue);
    const response = await fetch(queryUrl);

    const responseData = await response.json();
    suggests = responseData[1].slice(0, 9); // Берём первые 9 запросов

    for (i = 1; i < searchSuggestsList.length; i++) {
        updateNodeSuggest(i, suggests[i - 1]);
    }

    if (inputValue !== "" && suggests.length > 0) {
        searchSuggestsContainer.classList.add("active");
    }
    else if (searchHistory.length > 0 && inputValue === "")
        displaySearchHistory();
    else if (inputValue === "")
        searchSuggestsContainer.classList.remove("active");
});

searchSuggestsContainer.addEventListener("mousedown", evt => {
    const clickTarget = evt.target;

    if (clickTarget.tagName === "A")
        location.href = clickTarget.href;
    else if (clickTarget.tagName === "LI")
        location.href = clickTarget.firstChild.href;
})

searchBarFormInput.addEventListener("keydown", evt => {
    const inputValue = evt.target.value.trim();
    if ((inputValue === "" && searchHistory.length <= 0) || evt.isComposing || evt.keyCode === 229)
        return;

    // стрелка вниз
    if (evt.keyCode === 40)
        setActiveSuggest(activeSuggestIndex + 1)
    // стрелка вверх
    else if (evt.keyCode === 38) {
        // почему-то по дефолту стрелка вверху двигает каретку в начало строки
        evt.preventDefault();
        setActiveSuggest(activeSuggestIndex - 1);
    }
});

// если теряем фокус
searchBarForm.addEventListener("focusout", async evt => {
    searchSuggestsContainer.classList.remove("active");
});

searchBarForm.addEventListener("focusin", evt => {
    if (searchBarFormInput.value.trim() === '')
        displaySearchHistory();

    if (searchBarFormInput.value.trim() !== '' || searchHistory.length > 0)
        searchSuggestsContainer.classList.add("active");
});

function getRedirectUrlFromQueryWords(query) {
    const trimedQuery = query.trim();
    // у гугла и дак дак гоу зарезервирован '+' под свои нужды
    const encodedPlusChar = "%2B";

    const encodedQuery = encodeURI(trimedQuery).replaceAll("+", encodedPlusChar);
    const preferBrowser = getPreferBrowser();
    const redirectUrl = preferBrowser.searchUrl + encodedQuery;

    return redirectUrl;
}

function updateNodeSuggest(index, suggest, isHistory = false) {
    if (index < 0 || index >= searchSuggestsList.length)
        return;

    const currentLi = searchSuggestsList[index];

    if (index != 0 && index > suggests.length && !isHistory) {
        currentLi.style.display = "none";
        return;
    }

    const aEl = currentLi.querySelector("a");

    aEl.textContent = suggest;
    aEl.href = getRedirectUrlFromQueryWords(suggest);
    currentLi.style.display = "list-item";

    if (isHistory)
        currentLi.classList.add("history");
    else
        currentLi.classList.remove("history");
}


function getNormalizeIndex(index) {
    if (index < 0)
        return suggests.length === 0 ? searchHistory.length - 1 : suggests.length;
    else if (index > (suggests.length === 0 ? searchHistory.length - 1 : suggests.length))
        return 0;

    return index;
}

function addFocusToSuggest(index, isNeedCopyToInput = true) {
    if (index < 0 || (index > suggests.length && searchHistory.length <= 0))
        return;

    const suggest = searchSuggestsList[index];
    suggest.classList.add('active-link');

    // меняем значение инпута в зависимости от выбранной ссылки
    if (isNeedCopyToInput) {
        const aEl = suggest.querySelector("a");
        searchBarFormInput.value = aEl.textContent;
    }

}

function removeFocusFromSuggest(index) {
    if (index < 0 || (index > suggests.length && searchHistory.length <= 0))
        return;

    for (const suggest of searchSuggestsList) {
        suggest.classList.remove("active-link");
    }
}

function setActiveSuggest(index, changeInputValue = true) {
    removeFocusFromSuggest(getNormalizeIndex(activeSuggestIndex));
    activeSuggestIndex = getNormalizeIndex(index);
    addFocusToSuggest(activeSuggestIndex, changeInputValue);
}

function getSearchHistory() {
    const localStorageItem = localStorage.getItem(searchHistoryLocalStorageKey);
    if (localStorageItem === null)
        return [];

    const searchHistory = JSON.parse(localStorageItem);

    return searchHistory.slice(0, maxSearchHistoryItems);
}

function addInSearchHistory(searchQuery) {
    const currentSearchHistory = getSearchHistory();
    searchQuery = searchQuery.trim();
    if (currentSearchHistory.length > 0 && currentSearchHistory.some(x => x.toLowerCase() === searchQuery.toLowerCase()))
        return;

    currentSearchHistory.unshift(searchQuery);

    const newSearchHistory = JSON.stringify(currentSearchHistory.slice(0, maxSearchHistoryItems));
    localStorage.setItem(searchHistoryLocalStorageKey, newSearchHistory);
}

function displaySearchHistory() {
    for (i = 0; i < searchHistory.length; i++) {
        updateNodeSuggest(i, searchHistory[i], true);
    }

    if (searchBarFormInput.value.trim() !== '')
        activeSuggestIndex = -1;
}

const preferBrowserIndexLocalStorageKey = "prefer-browser-index";
function getPreferBrowser() {
    const browserIndex = localStorage.getItem(preferBrowserIndexLocalStorageKey) ?? 0;

    return browsers[browserIndex];
}

function setPreferBrowser(index) {
    localStorage.setItem(preferBrowserIndexLocalStorageKey, index);
}

