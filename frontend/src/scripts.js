import { requestKeyWord } from "./request";

const searchKeyword = () => {


    const inputSearch = document.querySelector(".search-bar");
    const btnSearch = document.querySelector(".search-button");

    btnSearch.addEventListener("click", async (event)=>{

        event.preventDefault();


        const data = await requestUserName(inputSearch.value);
    
    
    
    
        btnSearch.classList.toggle("btnClicked");

        console.log(data)

    })


}




