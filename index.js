const http = require('http');
const cluster = require('cluster');
const Server = require('./server');
const process = require('process');
const fs = require('fs');

// create a worker for each CPU and run the server on the 3rd worker
if(cluster.isMaster) {
    const cpuCount = require('os').cpus().length;
    for(let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
} else {
    if(cluster.worker.id == 3) {
        const server = new Server(3000);

        server.get("/", (req, res) => {
            console.log("Handling the root route");
            res.write("Welcome to the home page");
            res.end();
        });

        server.get("/about", (req, res) => {
            console.log("Handling the about route");
            res.write("Welcome to the about page");
            res.end();
        })
    }
}
// creating an event listener for the cluster
cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died`);
    cluster.fork();
});

process.on("beforeExit", () => {
    fs.appendFile("log.txt", `${new Date().toLocaleString()} - Process is about to exit \n`, (err) => {
        if(err) console.log(err);
    })
})