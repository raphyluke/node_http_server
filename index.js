const http = require('http');
const cluster = require('cluster');
const server = require('./server');

// create a worker for each CPU and run the server on the 3rd worker
if(cluster.isMaster) {
    const cpuCount = require('os').cpus().length;
    for(let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
} else {
    // run the server on the 3rd worker
    server(http);
}
// creating an event listener for the cluster
cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died`);
    cluster.fork();
});
