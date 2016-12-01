const express = require('@financial-times/n-express');
const nHealth = require('n-health');
const path = require('path');

const controllers = require('./controllers/index');
const hubPoller = require('./pollers/hub');

// start poller for data for the hub
hubPoller.start();

const healthChecks = nHealth(path.resolve(__dirname, 'config', 'health-checks'));

const app = express({
	healthChecks: healthChecks.asArray(),
	systemCode: 'next-video-page'
});

const video = express({
	hasHeadCss: true,
	hasNUiBundle: true,
	layoutsDir: path.join(process.cwd(), 'bower_components', 'n-ui', 'layout'),
	withAnonMiddleware: true,
	withFlags: true,
	withHandlebars: true,
	withNavigation: true
});

app.get('/__gtg', controllers.gtg);
app.use('/video', video);

video.get('/', controllers.hub);
/**
 * Handle moving traffic over from the old video.ft.com site, e.g urls of the format
 *
 *  - /videos/5215993791001
 *  - /videos/5215993791001//Fillon-and-the-French-centre-right-vote/Editors-Choice
 */
video.get('/:id(\\d+)*?', controllers.video);
/**
 * Currently acting as a catch all while we redirect traffic from video.ft.com
 */
video.get('/*', controllers.section);

const listen = app.listen(process.env.PORT || 3001);

module.exports = {
	listen
};
