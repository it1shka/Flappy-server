const http = require('http'),
    nedb = require('nedb');

const db = new nedb('highscores.db');
db.loadDatabase();

function doc(info){
    this.info = encodeQuery(info);
}

function encodeQuery(queryString){
    let decoded = decodeURIComponent(queryString);
    console.log(`Query string is decoded to ${decoded}`);
    return decoded;
}

http.createServer((req, res) => {
    if(req.method == "POST"){
        let body = '';
        req.on('data', data => {
            body += data;
            if(body.length > 1e6){
                req.connection.destroy();
            }

        });
        req.on('end', () => {
            //get some data, store in database
            console.log(`Got a message: ${body}`);
            let toSave = new doc(body);
            db.insert(toSave);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end();
        });
    }
    
    else{
        //send data to client
        db.find({}, (err, docs) =>{
            let toSend = JSON.stringify(
                docs.sort((a, b) => {
                    let af = JSON.parse(a.info),
                        bf = JSON.parse(b.info);
                    return bf.score - af.score;
                }).slice(0, 201)
            );
            console.log(`Sending a message: ${toSend}`);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(toSend);
        });

    }
}).listen(8080 || process.env.PORT, "127.0.0.1", () => {});
