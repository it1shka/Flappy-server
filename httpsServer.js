const express = require('express')
let app = express();
app.get('/', (req, res) => {
    res.send('Hello world!');
});
app.listen(5000, () => console.log('Listening on 3000...'));