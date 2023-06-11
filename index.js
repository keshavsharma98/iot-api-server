// const mongoose = require('mongoose');
// const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

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


let server;
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MongoDB');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });

server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});