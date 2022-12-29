const EventEmitter = require('events');
const fs = require('fs');
const ServerEmitter = new EventEmitter();

ServerEmitter.on("enter-home", () => {
    fs.appendFile("log.txt", `${new Date().toLocaleString()} - Welcome to the home page \n`, (err) => {
        if(err) console.log(err);
    })
})

function server(http){
    return http.createServer((req, res) => {
        if(req.url === '/') {
            ServerEmitter.emit('enter-home');
            res.write('Welcome to the home page');
            res.end();
            return;
        } else if(req.url === '/about') {
            res.write('Welcome to the about page');
            res.end();
            return;
        } 
        else if(req.url.search("/contact") != -1){
            if (req.url.split("/")[2] != undefined){
                res.end(req.url.split("/")[2])
                return;
            }
            res.write('Welcome to the contact page');
            res.end();
            return;
        }
        else {
            res.write('404 Page not found');
            res.end();
            return;
        }
    }).listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

module.exports = server;