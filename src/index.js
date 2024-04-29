const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const port = 3000;

// Route used to scrap the amazon service of it's results
app.get(`/api/scrape/:keyword`, async (req, res) => {
  try {
    // Obtaining the keywordpass
    const keyword = req.query.keyword;

    // Verifying if the keyword was specified
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword not specified'});
    }

    // Utilizing The Amazon URL and passing the keyword as the parameter of the request_
    const amazonUrl = `https://www.amazon.com.br/s?k=${keyword}&adgrpid=124701253337&gclid=Cj0KCQjwir2xBhC_ARIsAMTXk84F-LNY7HWVH_mPeZMVM2rV5AKj6b09gBTMGVe3lyRsM2TbOhygZaUaApqHEALw_wcB&hvadid=595919722967&hvdev=c&hvlocphy=1001655&hvnetw=g&hvqmt=e&hvrand=15958251163522805258&hvtargid=kwd-342241737280&hydadcr=12133_13330093&tag=hydrbrgk-20&ref=pd_sl_l0dbszrb9_e`;

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
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Initializing Server
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
