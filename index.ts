interface QuoteInterface {
    anime: string,
    character: string,
    quote: string
}

function fetchRandomQuote(): Promise<QuoteInterface> {
    return new Promise<QuoteInterface>((resolve, reject) =>
        fetch("https://animechan.vercel.app/api/random")
            .then(async (response) => resolve(await response.json()))
            .catch((err) => reject(err))
    );
}


function updateRandomQuote(quote: QuoteInterface) {
    const randomQuoteWrapper: HTMLDivElement | null = document.querySelector(".rng-quote-wrapper");
    if (!randomQuoteWrapper)
        throw new Error("Random quote element wasn\'t found!");


    document.getElementById("rng-title-name")!.textContent = `Title: ${quote.anime}`;
    document.getElementById("rng-character-name")!.textContent = `Character: ${quote.character}`;
    document.getElementById("rng-character-quote")!.textContent = quote.quote;
}


fetchRandomQuote()
    .then((quote) => updateRandomQuote(quote))
    .catch((err) => console.error(err))

const quoteTemplate: HTMLTemplateElement | null = <HTMLTemplateElement>document.getElementById("quote-template");
if (!quoteTemplate)
    throw new Error("Can\'t find quote template!");

const randomQuoteButton: HTMLButtonElement | null = document.querySelector(".rng-quote-button");
if (randomQuoteButton) {
    randomQuoteButton.addEventListener("click", () => {
        fetchRandomQuote()
            .then((quote) => updateRandomQuote(quote))
            .catch((err) => console.error(err))
    })
}


function getAvailableTitles(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        fetch("https://animechan.vercel.app/api/available/anime")
            .then(async (response) => resolve(await response.json()))
            .catch((err) => reject(err))
    })
}

function fetchTitleQuotes(name: string): Promise<Array<QuoteInterface>> {
    return new Promise((resolve, reject) => {
            fetch(`https://animechan.vercel.app/api/quotes/anime?title=${name}`)
                .then(async (response) => {
                    const quotes: Array<QuoteInterface> = await response.json();
                    resolve(quotes);
                })
                .catch((err) => reject(err))
        }
    );
}

const titleSelector: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById("title-selector");
if (!titleSelector)
    throw new Error("Can\'t find title selector box!");

const titleQuotesButton: HTMLButtonElement | null = document.querySelector(".title-quotes-button");
if (!titleQuotesButton)
    throw new Error("Can\'t find fetch title button!");

const titleQuotesContainer: HTMLDivElement | null = document.querySelector(".title-quotes-container");
if (!titleQuotesContainer)
    throw new Error("Can\'t find title quotes container!");

getAvailableTitles().then((availableTitles) => {
    availableTitles.forEach((title) => {
        const newTitle: HTMLOptionElement = document.createElement("option");
        newTitle.text = title;
        titleSelector.appendChild(newTitle);
    })
});

titleQuotesButton.addEventListener("click", () => {
    const selectedOption: string = titleSelector.options[titleSelector.selectedIndex].text;
    fetchTitleQuotes(selectedOption)
        .then((quotes) => {
            titleQuotesContainer.replaceChildren();
            const displayedQuotes: Array<string> = [];

            quotes.forEach((quoteObject) => {
                if (displayedQuotes.includes(quoteObject.quote)) return;

                const newQuote: HTMLDivElement | null = <HTMLDivElement>quoteTemplate.content.cloneNode(true);
                newQuote.querySelector(".quote-character-name")!.textContent = quoteObject.character
                newQuote.querySelector(".quote-character-text")!.textContent = quoteObject.quote
                titleQuotesContainer.appendChild(newQuote);
                displayedQuotes.push(quoteObject.quote);
            })
        })
})
