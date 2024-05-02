import { requestKeyWord } from "./request.js";
 

let data = [];


const searchKeyword = () => {
    
    const inputSearch = document.querySelector(".search-bar");
    const btnSearch = document.querySelector(".search-button");

    btnSearch.addEventListener("click", async (event)=>{

        event.preventDefault();


        data = await requestKeyWord(inputSearch.value);
    
        btnSearch.classList.toggle("btnClicked");

        console.log(data)

        return data;

})

};

const dataSearch = await requestKeyWord();

searchKeyword();

if(dataSearch){
const cards = (data) => {

    const containerCards = document.querySelector(".render-list"); 
               
    data.forEach(element => {
       const cards = renderCards(element);
       containerCards.appendChild(cards)

    });
   }
   
   const renderCards = ({title,rating,reviews,imageUrl}) => {

       
       const card = document.createElement("li");
       const divImage = document.createElement("div");
       const divTitle = document.createElement("div");
       const divRating = document.createElement("div");
       const divReviews = document.createElement("div");
       const cardTitle = document.createElement("h2");
       const cardStar = document.createElement("img");
       const cardRating = document.createElement("span");
       const cardReview = document.createElement("p");    
       const cardImg = document.createElement("img");

       card.classList.add("card");
       divTitle.classList.add("divTitle");
       divRating.classList.add("divRating");
       divReviews.classList.add("divReviews");
       cardTitle.classList.add("cardTitle");
       cardStar.classList.add("cardStar");
       cardRating.classList.add("cardRating");
       cardImg.classList.add("productImg");
       divImage.classList.add("divImage");
    
       cardImg.src = imageUrl;
       cardTitle.innerText = title;
       cardReview.innerText = reviews;
       cardRating.innerText = rating;
       cardStar.src = "./src/assets/img/star.svg"; 
       
       divImage.appendChild(cardImg);
       divTitle.appendChild(cardTitle);
       divRating.appendChild(cardRating);  
       divReviews.appendChild(cardReview);
       
       card.append(divImage, divTitle, divRating, divReviews);

       return card

   }
   cards(dataSearch);
}
else{

  console.log("error");


}

