const express = require('express')
let app = express();
app.get('/', (req, res) => {
    res.send('Hello world!');
});
app.listen(8080 || process.env.PORT, () => console.log('Listening on 3000...'));