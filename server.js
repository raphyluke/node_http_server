const EventEmitter = require('events');
const fs = require('fs');
const ServerEmitter = new EventEmitter();

ServerEmitter.on("enter-page", (page) => {
    fs.appendFile("log.txt", `${new Date().toLocaleString()} - Welcome to the ${page} page \n`, (err) => {
        if(err) console.log(err);
    })
})

function server(http){
    return http.createServer((req, res) => {
        var serverURL = req.url.split("/");
        // check if log.txt exists if not create it
        if(!fs.existsSync('log.txt')) {
            fs.writeFile('log.txt', '', (err) => {
                if(err) console.log(err);
            })
        }
        if(serverURL[1] == "home") {
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