const axios = require('axios');
const fs = require('fs');
require('dotenv').config()

const key = process.env.API_KEY

console.log('Starting script...');

// Read the list of codes from the JSON file
console.log('Reading codes from codes.json...');
fs.readFile('codes.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON data
    const codes = JSON.parse(data);

    const responseData = [];

    // Loop through the codes list
    codes.forEach(async (code, index) => {

        try {
            //  console.log('Making requests to UTS API...');

            // Make the GET request
            const response1 = await axios.get(`https://uts-ws.nlm.nih.gov/rest/search/current/?string=${code}&apiKey=${key}`);


            const results = response1.data.result.results.map(result => {
                return { name: result.name, uri: result.uri };
            });

            // Add the results array from the response data to the responseData array
            responseData[index] = {
                code: code,
                results: results
            };

            // Check if all the requests have completed
            if (responseData.length === codes.length) {
                // Write the response data to a JSON file
                // console.log('Writing response data to response_data.json...');
                fs.writeFile('response_data.json', JSON.stringify(responseData), 'utf8', err => {
                    if (err) {
                        console.error(err);
                    } else {
                        //console.log('Response data written to response_data.json');
                    }
                });
            }
        } catch (error) {
            // Print the error message
            console.error(`Failed to retrieve data for code ${code}: ${error}`);
        }
    });

});
console.log('Script complete.');
