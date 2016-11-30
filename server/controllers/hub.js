const hubPoller = require('../pollers/hub');

const addTrackingId = item => {
	const trackingId = item.title.toLowerCase()
		.replace(/[^\s\w]/g, '')
		.replace(/\s+/g, '-');
	return Object.assign({}, item, { trackingId });
};

module.exports = (req, res, next) => {
	res.nextMetricsName = 'hub';
	hubPoller.getData()
		.then(({
			data: {
				video: {
					hero: [hero] = [],
					editorsPicks = [],
					popular = []
				} = {},
				latest = [],
				markets = {},
				companies = {},
				world = {},
				lifeAndArts = {}
			} = {}
		} = {}) => {
			const sections = [markets, companies, world, lifeAndArts];
			const slices = [
				{
					title: 'Latest',
					id: 'latest',
					videos: latest
				},
				{
					title: 'Editor‘s Picks',
					id: 'editors-picks',
					videos: editorsPicks
				},
				{
					title: 'Popular',
					id: 'popular',
					videos: popular
				},
				...sections
			]
				.filter(({ videos = [] } = {}) => videos.length)
				.map(addTrackingId);
			res.render('hub', {
				layout: 'wrapper',
				title: 'Financial Times | Videos',
				hero,
				slices
			});
		})
		.catch(next);
};
