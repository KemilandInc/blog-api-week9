const express = require('express');
const cors = require('cors');
const RequestLogger = require('./middlewares/logger.js');
const errorhandler = require('./middlewares/errorHandler.js');

const ArticleRoutes = require('./routes/article.route.js');
const UserRoutes = require('./routes/user.route.js');

const app = express();


app.use(express.json());
app.use(cors('*'));

app.use(RequestLogger);

app.use('/api', ArticleRoutes);
app.use('/api/users', UserRoutes);

app.use(errorhandler);

module.exports = app;