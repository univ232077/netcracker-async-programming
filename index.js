"use strict";
function fetchRandomQuote() {
    return new Promise((resolve, reject) => fetch("https://animechan.vercel.app/api/random")
        .then(async (response) => resolve(await response.json()))
        .catch((err) => reject(err)));
}
function updateRandomQuote(quote) {
    const randomQuoteWrapper = document.querySelector(".rng-quote-wrapper");
    if (!randomQuoteWrapper)
        throw new Error("Random quote element wasn\'t found!");
    document.getElementById("rng-title-name").textContent = `Title: ${quote.anime}`;
    document.getElementById("rng-character-name").textContent = `Character: ${quote.character}`;
    document.getElementById("rng-character-quote").textContent = quote.quote;
}
fetchRandomQuote()
    .then((quote) => updateRandomQuote(quote))
    .catch((err) => console.error(err));
const quoteTemplate = document.getElementById("quote-template");
if (!quoteTemplate)
    throw new Error("Can\'t find quote template!");
const randomQuoteButton = document.querySelector(".rng-quote-button");
if (randomQuoteButton) {
    randomQuoteButton.addEventListener("click", () => {
        fetchRandomQuote()
            .then((quote) => updateRandomQuote(quote))
            .catch((err) => console.error(err));
    });
}
function getAvailableTitles() {
    return new Promise((resolve, reject) => {
        fetch("https://animechan.vercel.app/api/available/anime")
            .then(async (response) => resolve(await response.json()))
            .catch((err) => reject(err));
    });
}
function fetchTitleQuotes(name) {
    return new Promise((resolve, reject) => {
        fetch(`https://animechan.vercel.app/api/quotes/anime?title=${name}`)
            .then(async (response) => {
            const quotes = await response.json();
            resolve(quotes);
        })
            .catch((err) => reject(err));
    });
}
const titleSelector = document.getElementById("title-selector");
if (!titleSelector)
    throw new Error("Can\'t find title selector box!");
const titleQuotesButton = document.querySelector(".title-quotes-button");
if (!titleQuotesButton)
    throw new Error("Can\'t find fetch title button!");
const titleQuotesContainer = document.querySelector(".title-quotes-container");
if (!titleQuotesContainer)
    throw new Error("Can\'t find title quotes container!");
getAvailableTitles().then((availableTitles) => {
    availableTitles.forEach((title) => {
        const newTitle = document.createElement("option");
        newTitle.text = title;
        titleSelector.appendChild(newTitle);
    });
});
titleQuotesButton.addEventListener("click", () => {
    const selectedOption = titleSelector.options[titleSelector.selectedIndex].text;
    fetchTitleQuotes(selectedOption)
        .then((quotes) => {
        titleQuotesContainer.replaceChildren();
        const displayedQuotes = [];
        quotes.forEach((quoteObject) => {
            if (displayedQuotes.includes(quoteObject.quote))
                return;
            const newQuote = quoteTemplate.content.cloneNode(true);
            newQuote.querySelector(".quote-character-name").textContent = quoteObject.character;
            newQuote.querySelector(".quote-character-text").textContent = quoteObject.quote;
            titleQuotesContainer.appendChild(newQuote);
            displayedQuotes.push(quoteObject.quote);
        });
    });
});
//# sourceMappingURL=index.js.map