const express = require('@financial-times/n-express');
const path = require('path');

const controllers = require('./controllers/index');

const app = express({
	hasHeadCss: true,
	hasNUiBundle: true,
	layoutsDir: path.join(process.cwd(), 'bower_components', 'n-ui', 'layout'),
	systemCode: 'next-video-page',
	withAnonMiddleware: true,
	withFlags: true,
	withHandlebars: true,
	withNavigation: true
});

app.get('/__gtg', controllers.gtg);
app.get('/videos', controllers.hub);
app.get('/videos/:id', controllers.video);

const listen = app.listen(process.env.PORT || 3001);

module.exports = {
	listen
};
