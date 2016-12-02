const hubPoller = require('../pollers/hub');
const identity = require('../utils/idenitity');

const addTrackingId = item => {
	const trackingId = item.title.toLowerCase()
		.replace(/[^\s\w]/g, '')
		.replace(/\s+/g, '-');
	return Object.assign({}, item, { trackingId });
};

const addTeaserType = video => {
	let type = '';
	if (video.isOpinion) {
		type = 'opinion';
	} else if (video.isEditorsChoice) {
		type = 'editors-pick';
	}
	return Object.assign({}, video, { type });
};

module.exports = (req, res, next) => {
	res.nextMetricsName = 'hub';
	const useLatestHeroStyling = 'latest-hero-styling' in req.query;
	hubPoller.getData()
		.then(({
			data: {
				video: {
					hero: [hero] = [],
					editorsPicks = [],
					popular = []
				} = {},
				world = {},
				markets = {},
				opinion = {},
				ftFeatures = {},
				companies = {},
				shortView = {},
				lex = {},
				lifeAndArts = {},
				workAndCareers = {}
			} = {}
		} = {}) => {
			const sections = [world, markets, opinion, ftFeatures , companies, shortView, lex, lifeAndArts, workAndCareers];
			const slices = [
				{
					title: 'Editor’s Choice',
					id: 'editors-picks',
					videos: editorsPicks
				},
				{
					title: 'Trending',
					id: 'popular',
					videos: popular
				},
				...sections
			]
				.filter(identity)
				.filter(({ videos = [] } = {}) => videos.length)
				.map(addTrackingId)
				.map(slice => {
					const videos = slice.videos.map(addTeaserType);
					return Object.assign({}, slice, { videos })
				});
			res.render('hub', {
				layout: 'wrapper',
				title: 'Financial Times | Videos',
				useLatestHeroStyling,
				hero: addTeaserType(hero),
				slices
			});
		})
		.catch(next);
};
