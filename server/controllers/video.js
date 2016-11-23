const logger = require('@financial-times/n-logger').default;

const query = id => {
	return `{
		search(termName: "webUrl", termValue:"http://video.ft.com/${id}", limit: 1) {
			id
			relativeUrl
		}
	}`;
};

module.exports = (req, res, next) => {
	res.nextMetricsName = 'video';
	const brightcoveId = req.params.id;
	fetch(`https://next-api.ft.com/v1/query?query=${encodeURIComponent(query(brightcoveId))}&source=next-video-page`, {
		timeout: 3000,
		headers: {
			'X-Api-Key': process.env.NEXT_API_KEY
		}
	})
		.then(response => response.json())
		.then(({ data: { search: [video] = [] } } = {}) => {
			if (video) {
				// NOTE: once all video content has the correct `url`, can just use `relativeUrl` here
				// https://github.com/Financial-Times/next-es-interface/pull/605
				res.redirect(301, `/content/${video.id}`);
			} else {
				logger.error({ event: 'UNKNOWN_BRIGHTCOVE_VIDEO', brightcove_id: brightcoveId });
				res.redirect('/videos');
			}
		})
		.catch(err => {
			logger.error(err);
			res.redirect('/videos');
		});
};
