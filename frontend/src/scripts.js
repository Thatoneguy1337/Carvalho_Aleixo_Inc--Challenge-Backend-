import { requestKeyWord, baseRequest} from "./request.js";


const searchAllProducts = async () => {
    const allProductsData = await requestKeyWord("All departments"); // Passa uma string vazia para obter todos os produtos
    renderCards(allProductsData);
};


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

const renderCards = (data) => {
    const containerCards = document.querySelector(".render-list");
    containerCards.innerHTML = ""; // Cleans up previously searched product


    data.forEach((element) => {
        const card = createCard(element);
        containerCards.appendChild(card);
    });
};

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

searchKeyword();
searchAllProducts();
