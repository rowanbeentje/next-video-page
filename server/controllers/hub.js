const hubPoller = require('../pollers/hub');

const normaliseTag = tag => ({
	title: tag.prefLabel,
	url: tag.relativeUrl,
	videoCount: tag.contentCount,
	videos: tag.latestContent.map(normaliseVideo)
});

const normaliseVideo = video => {
	return Object.assign({}, video, { url: `/content/${video.id}`});
};

module.exports = (req, res, next) => {
	res.nextMetricsName = 'hub';
	hubPoller.getData()
		.then(({
			data: {
				video: {
					highlight: [highlight],
					editorsPicks,
					popular
				} = {},
				latestVideos,
				markets,
				companies,
				world,
				lifeAndArts
			} = {}
		} = {}) => {
			const sections = [markets, companies, world, lifeAndArts].map(normaliseTag);
			const slices = [
				{
					title: 'Latest',
					videos: latestVideos.map(normaliseVideo)
				},
				{
					title: 'Editor‘s Picks',
					videos: editorsPicks.map(normaliseVideo)
				},
				{
					title: 'Popular',
					videos: popular.map(normaliseVideo)
				},
				...sections
			];
			res.render('hub', {
				layout: 'wrapper',
				title: 'Financial Times | Videos',
				highlight: normaliseVideo(highlight),
				slices
			});
		})
		.catch(next);
};
