var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var routes = require('./api/index');
var images = require('./api/images');
var captricity = require('./api/captricity');

var db_name = 'captricity';
var mongoose = require('mongoose');
var mongoose_connection_string =  'mongodb://heroku_wfp0t23b:heroku_wfp0t23b@ds035563.mongolab.com:35563/heroku_wfp0t23b';

if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

mongoose.connect(mongoose_connection_string, function(err) {
    if(err) {
        console.log('MongoDB connection error', err);
    } else {
        console.log('MongoDB connection successful');
    }
});

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip_address', process.env.OPENSHIFT_NODEJS_IP  || '127.0.0.1');
app.use(logger('dev'));
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.methodOverride());
// app.use(multer({ dest: './tmp/'}).single('theFile'));

app.use('/', routes);
app.use('/api', images);
app.use('/auth', captricity);


app.listen(app.get('port'), function() {
  console.log('Express server listening on ' + app.get('ip_address') + ' port ' + app.get('port'));
})
