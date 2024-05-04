import { requestKeyWord } from "./request.js";

const searchKeyword = async () => {
    const inputSearch = document.querySelector(".search-bar");
    const btnSearch = document.querySelector(".search-button");

    btnSearch.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const keyword = inputSearch.value;
        const data = await requestKeyWord(keyword);

        renderCards(data);
    });
};

const renderCards = (data) => {
    const containerCards = document.querySelector(".render-list");
    containerCards.innerHTML = ""; // Cleans up previously searched product

    if (data.length === 0) {
        console.log("No results were found for your search.");
        return;
    }

    data.forEach((element) => {
        const card = createCard(element);
        containerCards.appendChild(card);
    });
};

const createCard = ({ title, rating, reviews, imageUrl }) => {
    const card = document.createElement("li");
    card.classList.add("card");

    const divImage = document.createElement("div");
    divImage.classList.add("divImage");
    const cardImg = document.createElement("img");
    cardImg.classList.add("productImg");
    cardImg.src = imageUrl;
    divImage.appendChild(cardImg);

    const divTitle = document.createElement("div");
    divTitle.classList.add("divTitle");
    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("cardTitle");
    cardTitle.innerText = title;
    divTitle.appendChild(cardTitle);

    const divRating = document.createElement("div");
    divRating.classList.add("divRating");
    const cardStar = document.createElement("img");
    cardStar.classList.add("cardStar");
    cardStar.src = "./src/assets/img/star-7207.svg";
    const cardRating = document.createElement("span");
    cardRating.classList.add("cardRating");
    cardRating.innerText = rating;
    divRating.appendChild(cardStar);
    divRating.appendChild(cardRating);

    const divReviews = document.createElement("div");
    divReviews.classList.add("divReviews");
    const cardReview = document.createElement("p");
    cardReview.innerText = `Reviews:${reviews}`;
    divReviews.appendChild(cardReview);

    card.append(divImage, divTitle, divRating, divReviews);
    return card;
};

searchKeyword();

