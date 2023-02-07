const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const key = process.env.API_KEY;

fs.readFile('response.json', 'utf8', (err, data) => {
    if (err) throw err;

    const items = JSON.parse(data);

    items.forEach(async (item) => {
      const { uri } = item;

      const url = `${uri}?apiKey=${key}`

      try {
        const response = await axios.get(url);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    });
  });