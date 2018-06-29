const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');

const app = express();

// App setup
app.use(morgan('combined'));
app.use(bodyparser.json({ type: '*/*' }));
router(app);


// Server setup
const port = process.env.PORT || 3400;
const server = http.createServer(app);

server.listen(port);
console.log(`Server listening on port ${port}..`);
