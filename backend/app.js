const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressGraphql = require('express-graphql');
const cors = require('cors');
const app = express();
import { GraphQLUpload } from 'graphql-upload'
import { schema } from './graphql/schema'
import {
  getPhotos,
  addPhoto,
  editPhoto,
  deletePhoto,
  searchPhotos
} from './graphql/resolvers'
import { graphqlUploadExpress } from 'graphql-upload'

const root = {
  Upload: GraphQLUpload,
  getPhotos,
  addPhoto,
  editPhoto,
  deletePhoto,
  searchPhotos
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  expressGraphql({
    schema,
    rootValue: root,
    graphiql: true
  })
)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;