const express = require('express'),
    Database = require('nedb');
const { send } = require('process');
let app = express();
app.use(express.urlencoded());
let database = new Database('highscores.db');
database.loadDatabase();

function doc(info){
    this.info = info;
}
//get request
app.get('/', (req, res) => {
    database.find({}, (err, docs) => {
        let toSend = JSON.stringify(
            docs.sort((a, b) => {
                let af = JSON.parse(a.info),
                    bf = JSON.parse(b.info);
                return bf.score - af.score;
            }).slice(0, 201)
        );
        console.log(`Sending a package: ${toSend}`);
        res.send(toSend);
    });
});
//post request
app.post('/', (req, res) => {
    let pack = Object.keys(req.body)[0];
    database.insert(new doc(pack));
    console.log(`Inserting package: ${pack}`);
    res.send('data has been inserted into a database! ');
});

app.listen(8080 || process.env.PORT, () => console.log('Listening on 3000...'));