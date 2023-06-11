const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/routes');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

app.use(compression());

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use(function(req, res, next) {
  res.status(404);
  res.json({ error: 'Not found' });
  return;
});

module.exports = app;