const express = require('@financial-times/n-express');
const nHealth = require('n-health');
const path = require('path');

const controllers = require('./controllers/index');
const hubPoller = require('./pollers/hub');

// start poller for data for the hub
hubPoller.start();

const healthChecks = nHealth(path.resolve(__dirname, 'config', 'health-checks'));

const app = express({
	hasHeadCss: true,
	hasNUiBundle: true,
	healthChecks: healthChecks.asArray(),
	layoutsDir: path.join(process.cwd(), 'bower_components', 'n-ui', 'layout'),
	systemCode: 'next-video-page',
	withAnonMiddleware: true,
	withFlags: true,
	withHandlebars: true,
	withNavigation: true
});

app.get('/__gtg', controllers.gtg);
app.get('/videos', controllers.hub);
/**
 * Handle moving traffic over from the old video.ft.com site, e.g urls of the format
 *
 *  - /videos/5215993791001
 *  - /videos/5215993791001//Fillon-and-the-French-centre-right-vote/Editors-Choice
 */
app.get('/videos/:id(\\d+)*?', controllers.video);
/**
 * Currently acting as a catch all while we redirect traffic from video.ft.com
 */
app.get('/videos/*', controllers.section);

const listen = app.listen(process.env.PORT || 3001);

module.exports = {
	listen
};
