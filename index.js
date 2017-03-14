'use strict';

const config = require('./conf');
const app = require('./app');
const routing = require('./routing');

app(routing, config);





