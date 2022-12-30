const http = require('http');
const cluster = require('cluster');
const server = require('./server');
const process = require('process');
const fs = require('fs');

// create a worker for each CPU and run the server on the 3rd worker
if(cluster.isMaster) {
    const cpuCount = require('os').cpus().length;
    for(let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
} else {
    server(http);
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