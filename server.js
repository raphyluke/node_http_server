const EventEmitter = require('events');
const fs = require('fs');
const ServerEmitter = new EventEmitter();
const http = require('http');

ServerEmitter.on("enter-page", (page) => {
    fs.appendFile("log.txt", `${new Date().toLocaleString()} - Welcome to the ${page} page \n`, (err) => {
        if(err) console.log(err);
    })
})

function server(){
    return http.createServer((req, res) => {
        var serverURL = req.url.split("/");
        // check if log.txt exists if not create it
        if(!fs.existsSync('log.txt')) {
            fs.writeFile('log.txt', '', (err) => {
                if(err) console.log(err);
            })
        }
        if(serverURL[1] == "") {
            ServerEmitter.emit('enter-page', 'home');   
            res.write('Welcome to the home page');
            res.end();
            return;
        } else if(serverURL[1] == "about") {
            ServerEmitter.emit('enter-page', 'about');
            res.write('Welcome to the about page');
            res.end();
            return;
        } 
        else if(serverURL[1] == "contact"){
            if (serverURL[2] != undefined){
                ServerEmitter.emit('enter-page', 'contact/'+req.url.split("/")[2]);
                res.end(req.url.split("/")[2])
                return;
            }
            ServerEmitter.emit('enter-page', 'contact');
            res.write('Welcome to the contact page');
            res.end();
            return;
        }
        else if (serverURL[1] == "log"){
            // GET request only
            if(req.method != "GET") {
                res.write('404 Page not found');
                res.end();
                return;
            }
            return fs.readFile('log.txt', (err, data) => {
                if(err) console.log(err);
                ServerEmitter.emit('enter-page', 'log');
                res.write(data);
                res.end();
            })
        }
        else if (serverURL[1] == "request"){
            if (req.method == "POST"){
                const chunks = [];
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    console.log("all parts/chunks have arrived");
                    const data = Buffer.concat(chunks);
                    console.log("Data: ", data.toString());
                    res.write(data.toString());
                    res.end()
                });
            }
            else {
                res.write('404 Page not found');
                res.end();
                return;
            }
        }
        else {
            res.write('404 Page not found');
            res.end();
            return;
        }
    }).listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}

module.exports = server;