// Importing the necessary dependencies 
const express = require('express'); // Importing Express framework to create the server
const axios = require('axios'); // Importing Axios for making HTTP requests
const { JSDOM } = require('jsdom'); // Importing JSDOM for parsing and manipulating HTML documents
const cors = require('cors'); // Importing CORS middleware for enabling cross-origin resource sharing

// Creating application using express, so it possibilitate our server to run 
const app = express(); // Initializing Express application

const port = 3000; // Setting the port number for the server to listen to

// Adding cors middlewares to the application, to better treat possible errors
app.use(cors()); // Enabling CORS middleware

// Transforming express application results into Json 
app.use(express.json()); // Parsing incoming request bodies in JSON format

// Route used to scrap the amazon service of it's results utilizing 
app.get(`/api/scrape/:keyword?`, async (req, res) => {
  while (true) { // Infinite loop to keep scraping until data is found or an error occurs
    try {
      // Obtaining the keyword from the request parameters
      let keyword = req.params.keyword || '';

      // Verifying if the keyword was specified
      if (!keyword) {
        return res.status(400).json({ error: 'Keyword not specified'}); // Sending an error response if keyword is not specified
      }

      // Utilizing the Amazon URL and passing the keyword as the parameter of the request
      const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

      // Making a request to the Amazon service using Axios
      const response = await axios.get(amazonUrl);

      console.log(response)

      // Utilizing JSDOM to manipulate HTML elements
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Array to store product details
      const products = [];

      // Manipulating the product elements and integrating them into a product array
      const productElements = document.querySelectorAll('[data-asin]');
      productElements.forEach(productElement => {
        // Your code to extract product details goes here
        const titleElement = productElement.querySelector('h2.a-size-mini a.a-link-normal'); // Selecting the HTML element so we can capture it and store in our product array
        const title = titleElement ? titleElement.textContent.trim() : 'N/A'; // Utilizing trim to remove the blank spaces contained in the text(if it exists) using ternary operators

        const ratingElement = productElement.querySelector('span.a-declarative i.a-icon-star-small'); // Selecting the HTML element so we can capture it and store in our product array
        const ratingText = ratingElement ? ratingElement.textContent.trim() : 'N/A'; // Utilizing trim to remove the blank spaces contained in the text(If it exists) using ternary operators
        const rating = parseFloat(ratingText.replace(',', '.')); // Converting commas into dots to insure it's a valid number utilizing the parseFloat method

        const reviewsElement = productElement.querySelector('a.a-link-normal span.a-size-base'); // Selecting the HTML element so we can capture it and store it in our product array
        const reviewsText = reviewsElement ? reviewsElement.textContent.trim() : 'N/A'; // Utilizing trim to remove the blank spaces contained in the text(if it exists) using ternary operators
        const reviewsMatch = reviewsText.match(/\d+/g); // 'g' means global correspondence to find occurences
        const reviews = reviewsMatch ? parseInt(reviewsMatch.join('')).toLocaleString() : 'N/A'; // separates digits and coverge the rest of the numbers

  
  

        const imageElement = productElement.querySelector('img.s-image'); // Selecting the HTML element so we can capture it and store in our product array
        const imageUrl = imageElement ? imageElement.getAttribute('src') : 'N/A'; // Extracting image from the source of the HTML Element{If it exists} using ternary operators


        products.push({
        title,
        rating,
        reviews,
        imageUrl
      }); // Storing the data we've just scrapped from the URL into our product array, by using our push method 


      });

        // Verificando se encontramos algum produto
        if (products.length > 0) {
          // Se chegamos aqui, significa que encontramos os dados que o usuário procura, então podemos retornar os produtos
          res.json(products); // Sending the products as a JSON response
          return;
        } else {
         // Se não encontramos os dados, esperamos um pouco antes de tentar novamente
         console.log('Data not found, retrying...');
         await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos antes de tentar novamente
        }

    } catch (error) {
      // Se ocorrer um erro durante o scraping, vamos tentar novamente até atingir o número máximo de tentativas
      console.error('Error:', error); // Logging the error
      console.log(`Retrying scraping`); // Logging that scraping will be retried
    }
  }
});

// Initializing Server
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`); // Logging that the server is running and listening to the specified port
});







