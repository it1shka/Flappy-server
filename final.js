// https://finalflappyserver.oa.r.appspot.com 

const express = require('express');
const app = express();

app.use(express.urlencoded());

const {Datastore} = require('@google-cloud/datastore');
const  datastore = new Datastore();

const highscore_key = 'highscore_1';

const insertHighscore = (highscore) => {
    return datastore.save({
        key: datastore.key(highscore_key),
        data: highscore
    });
};

const getHighscores = () => {
    let query = datastore
        .createQuery(highscore_key)
        .order('score', {descending: true})
        .limit(200);

    return datastore.runQuery(query);
};

app.get('/', async (req, res, next) => {
    try{
        let [highscores] = await getHighscores();
        res.send(highscores);
    }catch(error){
        next(error);
    }
});


app.post('/', async (req, res, next) => {
    try{
        let highscore = JSON.parse(Object.keys(req.body)[0]);
        await insertHighscore(highscore);
        res.send('OK');
    }catch(error){
        next(error);
    }
});

app.listen(8080 || process.env.PORT, () => console.log('Listening...'));