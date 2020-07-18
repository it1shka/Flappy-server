//https://finalflappyserver.oa.r.appspot.com/

const express = require('express'),
    app = express();

app.use(express.urlencoded());

const {Datastore} = require('@google-cloud/datastore'),
    datastore = new Datastore();

const insertHighscore = (highscore) => {
    return datastore.save({
        key: datastore.key('highscore'),
        data: highscore
    });
};

const getHighscores = () => {
    let query = datastore
        .createQuery('highscore')
        .order('score', {descending: true})
        .limit(200);

    return datastore.runQuery(query);
};

app.get('/', async (req, res, next) => {
    try{
        let [highscores] = await getHighscores();
        res.send(JSON.stringify(highscores));
    }catch(error){
        next(error);
    }
});

app.post('/', async (req, res, next) => {
    try{
        let highscore = Object.keys(req.body)[0];
        await insertHighscore(highscore);
        res.send('Successfully inserted!');
    }catch(error){
        next(error);
    }
});

app.listen(8080 || process.env.PORT, () => console.log('Listening...'));