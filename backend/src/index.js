// Importing the necessary dependencies 
const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');


// Creating application using express, so it possibilitate our server to run 
const app = express();

// Defining which port our server will run  
const port = 3000;

// Adding cors middlewares to the application, to better treat possible errors
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
    
    // Checking if our response is working
    console.log(response);

    // Utilizg JSDOM to manipulate HTML elements
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Array to store product details
    const products = [];


    // Managing product elements and integrating them in a product array 
    const productElements = document.querySelectorAll('[data-asin]');
    // Using the forEach method so we can 
    productElements.forEach(productElement => {
      const titleElement = productElement.querySelector('h2.a-size-mini a.a-link-normal'); // Selecting the HTML element so we can capture it and store in our product array
      const title = titleElement ? titleElement.textContent.trim() : 'N/A'; // Utilizing trim to remove the blank spaces contained in the text(if it exists) using ternary operators

      const ratingElement = productElement.querySelector('span.a-declarative i.a-icon-star-small'); // Selecting the HTML element so we can capture it and store in our product array
      const ratingText = ratingElement ? ratingElement.textContent.trim() : 'N/A'; // Utilizing trim to remove the blank spaces contained in the text(If it exists) using ternary operators
      const rating = parseFloat(ratingText.replace(',', '.')); // Converting commas into dots to insure it's a valid number utilizing the parseFloat method

      const reviewsElement = productElement.querySelector('a.a-link-normal span.a-size-base'); // Selecting the HTML element so we can capture it and store it in our product array
      const reviewsText = reviewsElement ? reviewsElement.textContent.trim() : 'N/A'; // Utilizing trim to remove the blank spaces contained in the text(if it exists) using ternary operators
      const reviewsMatch = reviewsText.match(/\d+/); // Using regex to extract only the digits
      const reviews = reviewsMatch ? parseInt(reviewsMatch[0]) : 'N/A';  // Utilizing parseInt to parse Json response(If it exists) using ternary operators

  
  

      const imageElement = productElement.querySelector('img.s-image'); // Selecting the HTML element so we can capture it and store in our product array
      const imageUrl = imageElement ? imageElement.getAttribute('src') : 'N/A'; // Extracting image from the source of the HTML Element{If it exists} using ternary operators


      products.push({
        title,
        rating,
        reviews,
        imageUrl
      }); // Storing the data we've just scrapped from the URL into our product array, by using our push method 
    });


    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(503).json({ error: '503 error on the Amazon Url! Reload and try again!' }); // Returning Application errors in Json Format
  }
});

// Initializing Server
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});