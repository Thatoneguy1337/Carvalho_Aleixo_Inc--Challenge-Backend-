const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const port = 3000;

app.get('/search/:keyword', async (req, res) => {
  try {

    // KeyWord used to search the determined products
    const keyword = req.params.keyword;

    // Verifying if the keyword was provided
    if (!keyword) {
        return res.status(400).send('Palavra-chave não especificada');
      }


    // Amazon Service requisition utilizing Axios and the keyword to use and search the products 
    const response = await axios.get(`https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}&ref=nb_sb_noss`);

    // JSDOM used to manipulate HTML
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    console.log(response)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/`);
});
