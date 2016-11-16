module.exports = (req, res, next) => {
	res.nextMetricsName = 'hub';
	const query = `{
		videos(limit: 1) {
			id
			title
		}
	}`;

	fetch(`https://next-api.ft.com/v1/query?query=${query}&source=next-video-page`, {
		timeout: 3000,
		headers: {}
	})
		.then(response => response.json())
		.then(({ data: { videos: [video] } = {} } = {}) => {
			res.render('hub', {
				layout: 'wrapper',
				title: 'Financial Times | Video',
				video
			});
		})
		.catch(next);
};
