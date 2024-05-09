//Imports necessary functions from the request.js file.
import { requestKeyWord, baseRequest} from "./request.js";

//Defines a function to search for all products, passing an empty string to obtain all products, and then renders them using the renderCards function.
const searchAllProducts = async () => {
    const allProductsData = await requestKeyWord("All departments");
    renderCards(allProductsData);
};

//Defines a function to search for products based on a keyword entered by the user. It listens for a click event on the search button, gets the keyword from the input field, searches for the products, and renders them using the renderCards function.
const searchKeyword = async () => {
    const inputSearch = document.querySelector(".search-bar");
    const btnSearch = document.querySelector(".search-button");

    btnSearch.addEventListener("click", async (event) => {
        event.preventDefault();
        
        const keyword = inputSearch.value;
        const noSearch = await baseRequest;
        const dataSearch = await requestKeyWord(keyword);

        if(dataSearch){
         renderCards(dataSearch);
        }
        else{
           renderCards(noSearch); 
        }

    });
};

//Defines a function to render product cards on the page. It receives an array of product data, clears the container for previous products, and then iterates over the data to create and append new product cards to the container.
const renderCards = (data) => {
    const containerCards = document.querySelector(".render-list");
    containerCards.innerHTML = ""; // Cleans up previously searched product


    data.forEach((element) => {
        const card = createCard(element);
        containerCards.appendChild(card);
    });
};

//Defines a function to create a product card element based on the provided data. It checks if any essential data is missing, and if so, returns a null element to indicate that the object should not be rendered. Otherwise, it creates a card element with the product details, including title, image, rating, and reviews.
const createCard = ({ title, rating, reviews, imageUrl }) => {
     
    if (title === "N/A" || rating === "N/A" || reviews === "N/A" || imageUrl === "N/A") {
        const nullableCard = document.createElement("h2"); 


        return nullableCard; // Return null to indicate the object should not be rendered
    }
    
    const card = document.createElement("li");
    card.classList.add("card");
    const divImage = document.createElement("div");
    divImage.classList.add("divImage");
    const cardImg = document.createElement("img");
    cardImg.classList.add("cardImg");
    cardImg.src = imageUrl;
    divImage.appendChild(cardImg);

    const divTitle = document.createElement("div");
    divTitle.classList.add("divTitle");
    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("cardTitle");
    cardTitle.innerText = title;
    divTitle.appendChild(cardTitle);

    const divStarRating = document.createElement("div");
    divStarRating.classList.add("divStarRating");
    const divRating = document.createElement("div");
    divRating.classList.add("divRating");
    const cardStar = document.createElement("img");
    cardStar.classList.add("cardStar");
    cardStar.src = "./src/assets/img/star-7207.svg";
    const cardRating = document.createElement("span");
    cardRating.classList.add("cardRating");
    cardRating.innerText = rating;
    divStarRating.append(cardStar, cardRating);
    

  
    const cardReview = document.createElement("strong");
    cardReview.innerText = `${reviews}`;
    cardReview.classList.add("reviewNumbers")
    divRating.append(divStarRating, cardReview);

    card.append(divImage, divTitle, divRating);
    return card;
};

// Calls the searchKeyword and searchAllProducts functions to initiate the product search and rendering processes when the script is loaded.
searchKeyword();
searchAllProducts();
