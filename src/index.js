// Importing the necessary dependencies 
const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');


// Creating application tha will possibilitate our server to run 
const app = express();

// Defining which port our server will run  
const port = 3000;

// Adding cors middlewares to the application to better treat possible errors
app.use(cors());

// Transforming express application results into Json 
app.use(express.json());

// Route used to scrap the amazon service of it's results utilizing 
app.get(`/api/scrape/:keyword`, async (req, res) => {
  try {
    // Obtaining the keywordpass
    let keyword = req.params.keyword;

    // Verifying if the keyword was specified
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword not specified'});
    }

    // Utilizing The Amazon URL and passing the keyword as the parameter of the request_
    const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

    // Fazendo requisição para o serviço da Amazon utilizando Axios
    const response = await axios.get(amazonUrl);
    
    console.log(response);

    // Utilizg JSDOM to manipulate HTML elements
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Array to store product details
    const products = [];


    // Managing product elements and integrating the in a product array 
    const productElements = document.querySelectorAll('[data-asin]');

    productElements.forEach(productElement => {
      const titleElement = productElement.querySelector('h2.a-size-mini a.a-link-normal');
      const title = titleElement ? titleElement.textContent.trim() : 'N/A';

      const ratingElement = productElement.querySelector('span.a-declarative i.a-icon-star-small');;
      const ratingText = ratingElement ? ratingElement.textContent.trim() : 'N/A';
      const rating = parseFloat(ratingText.replace(',', '.')); // Converting commas into dots to insure it's a valid number

      const reviewsElement = productElement.querySelector('a.a-link-normal span.a-size-base');
      const reviewsText = reviewsElement ? reviewsElement.textContent.trim() : 'N/A';
      const reviewsMatch = reviewsText.match(/\d+/); // Use regex para extrair apenas os dígitos
      const reviews = reviewsMatch ? parseInt(reviewsMatch[0]) : 'N/A';
  
  

      const imageElement = productElement.querySelector('img.s-image');
      const imageUrl = imageElement ? imageElement.getAttribute('src') : 'N/A';

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
