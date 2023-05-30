const EventEmitter = require('events');
const fs = require('fs');
const http = require('http');

const ServerEmitter = new EventEmitter();

ServerEmitter.on('enter-page', (page) => {
  fs.appendFile('log.txt', `${new Date().toLocaleString()} - Welcome to the ${page} page \n`, (err) => {
    if (err) console.log(err);
  });
});

class Server {
  constructor(port) {
    this.routes = [];
    this.server = http.createServer((req, res) => {
      const serverURL = req.url.split('/');

      // Find the matching route and execute the callback
      const route = this.routes.find((route) => {
        const [method, url] = route.url.split(' ');
        const joinedURL = serverURL.join('/');
        return joinedURL === req.url;
      });

      if (route) {
        const { callback } = route;
        callback(req, res); // Invoke the callback with req and res objects
      } else {
        res.statusCode = 404;
        res.end('Page not found');
        console.log(this.routes);
        console.log(req.url)
      }
    });

    this.server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use.`);
      } else {
        console.error('An error occurred:', err);
      }
      process.exit(1); // Terminate the process
    });

    // Start the server on the specified port
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Emit event for logging
    ServerEmitter.emit('enter-page', '/');
  }

  get(url, callback) {
    this.routes.push({ url: `${url}`, callback: callback });
  }

  post(url, callback) {
    this.routes.push({ url: `${url}`, callback: callback });
  }

  put(url, callback) {
    this.routes.push({ url: `${url}`, callback: callback });
  }

  delete(url, callback) {
    this.routes.push({ url: `${url}`, callback: callback });
  }
}

module.exports = Server;
