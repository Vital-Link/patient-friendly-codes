const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const key = process.env.API_KEY;

console.log('Starting script...');

// Read the codes.json file. Each object has an id and a term.
console.log('Reading codes from codes.json...');
fs.readFile('codes.json', 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON data into an array of objects.
    const codes = JSON.parse(data);

    // Array to hold the responses.
    const responseData = [];

    // Array to hold promises.
    const promises = [];

    // For each code, make a request to the API using the code's term and add the promise to the array.
    console.log('Making requests to API...');
    codes.forEach(code => {
        const url = `https://uts-ws.nlm.nih.gov/rest/search/current/?string=${code.term}&apiKey=${key}&searchType=exact`;
        promises.push(axios.get(url));
    });

    // Wait for all promises to resolve.
    await Promise.all(promises)
        .then(responses => {
            // For each response, extract the desired information and add it to the responseData array.
            responses.forEach((response, index) => {
                const result = {
                    id: codes[index].id,
                    term: response.data.result.results[0].name,
                    uri: response.data.result.results[0].uri
                };
                responseData.push(result);
            });
        })
        .catch(error => {
            console.error(`Failed to retrieve data for code: ${error}`);
        });

    // Write the response data to a file.
    console.log('Writing response data to file...');
    fs.writeFile('response.json', JSON.stringify(responseData), err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File written successfully.');
    });
});

console.log('Script complete.');
