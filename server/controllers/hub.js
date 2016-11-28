const hubPoller = require('../pollers/hub');

module.exports = (req, res, next) => {
	res.nextMetricsName = 'hub';
	hubPoller.getData()
		.then(({
			data: {
				video: {
					highlight: [highlight] = [],
					editorsPicks = [],
					popular = []
				} = {},
				latestVideos = [],
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
					videos: latestVideos
				},
				{
					title: 'Editor‘s Picks',
					videos: editorsPicks
				},
				{
					title: 'Popular',
					videos: popular
				},
				...sections
			]
				.filter(({ videos = [] } = {}) => videos.length);
			res.render('hub', {
				layout: 'wrapper',
				title: 'Financial Times | Videos',
				highlight,
				slices
			});
		})
		.catch(next);
};
