module.exports = {
	name: 'App',
	description : 'Check the metrics of the app',
	checks : [
		{
			name: '5xx Responses (high)',
			severity: 1,
			businessImpact: 'Next API may not be responding to requests',
			technicalSummary: 'Check there haven‘t been more than 10 5xx responses from the app in the last 10 minutes',
			panicGuide: 'Check Grafana (http://grafana.ft.com/dashboard/db/next-video-page?panelId=5&fullscreen) for `5xx` related errors and Splunk (http://bit.ly/2gbqIWh) and Sentry (https://sentry.io/nextftcom/ft-next-video-page/) for error logging',
			type: 'graphiteThreshold',
			metric: 'integral(heroku.api.web_*.express.query_*.res.status.5*.count)',
			samplePeriod: '10min',
			threshold: 10
		},
		{
			name: '5xx Responses (low)',
			severity: 2,
			businessImpact: 'Next API may not be responding to requests',
			technicalSummary: 'Check there haven‘t been any 5xx responses from the app in the last 10 minutes',
			panicGuide: 'Check Grafana (http://grafana.ft.com/dashboard/db/next-video-page?panelId=5&fullscreen) for `5xx` related errors and Splunk (http://bit.ly/2gbqIWh) and Sentry (https://sentry.io/nextftcom/ft-next-video-page/) for error logging',
			type: 'graphiteThreshold',
			metric: 'integral(heroku.api.web_*.express.query_*.res.status.5*.count)',
			samplePeriod: '10min',
			threshold: 0
		}
	]
};
