var express = require('express');
var compression = require('compression');
var path = require('path');
var serveStatic = require('serve-static');
var env = process.env.NODE_ENV || 'development';

app = express();

app.use( compression() )

var forceSsl = function (req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};

if (env === 'production') {
	app.use(forceSsl);
}

app.use(serveStatic(__dirname));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

var port = process.env.PORT || 5000;
app.listen(port);

console.log('server started '+ port);
