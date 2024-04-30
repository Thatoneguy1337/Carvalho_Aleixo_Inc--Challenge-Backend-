// Importing the necessary dependencies 
import "express-async-errors";
import "reflect-metadata";
import cors from "cors";
import express from "express";
import axios from "axios"
import cors from "cors";
import { JSDOM } from "jsdom";


// Creating application tha will possibilitate our server to run 
const app = express();

// Defining which port our server will run  
const port = 3000;

// Adding cors middlewares to the application to better treat possible errors
app.use(cors());

// Transforming express application results into Json 
app.use(express.json());

// Route used to scrap the amazon service of it's results utilizing 
app.get(`api/scrape/:keyword`, async (req, res) => {
  try {
    // Obtaining the keywordpass
    const keyword = req.params.keyword;

    // Verifying if the keyword was specified
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword not specified'});
    }

    // Utilizing The Amazon URL and passing the keyword as the parameter of the request_
    const amazonUrl = `https://www.amazon.com.br/s?k=${keyword}`;

    // Fazendo requisição para o serviço da Amazon utilizando Axios
    const response = await axios.get(amazonUrl);
    
    // Utilizg JSDOM to manipulate HTML elements
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Array to store product details
    const products = [];

    // Finding elements in the product pages
    const productElements = document.querySelectorAll('.s-result-item');

    // Managing product elements and integrating the in a product array 
    productElements.forEach(productElement => {
      const titleElement = productElement.querySelector('h2 span');
      const title = titleElement ? titleElement.textContent.trim() : 'N/A';

      const ratingElement = productElement.querySelector('.a-icon-star-small');
      const rating = ratingElement ? parseFloat(ratingElement.getAttribute('aria-label').split(' ')[0]) : 0;

      const reviewsElement = productElement.querySelector('.a-size-small');
      const reviews = reviewsElement ? parseInt(reviewsElement.textContent.replace(/[^\d]/g, '')) : 0;

      const imageElement = productElement.querySelector('img');
      const imageUrl = imageElement ? imageElement.getAttribute('src') : 'N/A';

      // Adding details to searched products inside the application 
      products.push({
        title,
        rating,
        reviews,
        imageUrl
      });
    });

    // Returning Application errors in Json Format
    res.json(products);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Initializing Server
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
