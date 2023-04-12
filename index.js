const express = require("express");
const request = require('request');
const store = require('store')
const requestPromise = require('request-promise');
store.set("data","1.0,0.0,1.0,9.0,10.0")
const PORT = 3000;
const app = express();

function middleware(req, res, next) {
    var test = req.originalUrl.slice(23,27)
    var spliced_data_collected = req.originalUrl.slice(33,);

    if (test != 'true') {
        var str = store.get("data")
        var options = {
            method: 'GET',
            uri: 'http://127.0.0.1:5000?data='+str,
            json: true
        };

        request(options, function (error, response, body) {
            console.log('body:', body); 
            store.set("data", body.data)
            console.log(store.get("data"));
            req.message = body.message
            next(); 
        }); 
    }
    else {
        var options = {
            method: 'GET',
            uri: 'http://127.0.0.1:5000?data='+spliced_data_collected,
            json: true
        };

        request(options, function (error, response, body) {
            console.log('body:', body); 
            store.set("data", body.data)
            console.log(store.get("data"));
            req.message = body.message
            next(); 
        });
    }
}

app.get("/ServerAccessAPI", middleware, (req, res) => {
   let result = req.message;
   res.send(result)
});

app.get("/ddos", middleware, (req, res) => {
    var urls = []
    var data = [1.0, 0.0, 1.0, 9.0, 10.0]
    for (let i = 0; i < 1000; i++) {
        if (i > 50) {
            data[2] += 1
        }
        urls.push("http://localhost:3000/ServerAccessAPI/?test=true&data="+data)        
    }
    const promises = urls.map(url => requestPromise(url));
    Promise.all(promises).then((data) => {
        console.log(data);
    });
    res.send("<h3>DDOS Attack Performed</h3>")
 });

app.get("/WhiteListMyIP", (req, res) => {
    var options = {
        method: 'GET',
        uri: 'http://127.0.0.1:5000/WhiteListMyIP',
        json: true
    };

    request(options, function (error, response, body) {
        res.send(body)
    });
});

app.listen(PORT, function (){ 
    console.log(`Server is running on Port ${PORT}`);
});  