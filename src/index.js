const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    // Amazon Service requisition utilizing Axios
    const response = await axios.get('https://example.com');
    
    // JSDOM used to manipulate HTML
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const pageTitle = document.querySelector('title').textContent;

    res.send(`Title: ${pageTitle}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
