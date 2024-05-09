const express = require('express');
const app = express();
const port = 8008; // Choose any port you like


app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
