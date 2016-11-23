const logger = require('@financial-times/n-logger').default;

/**
 * Mapping of video.ft.com section to www.ft.com section
 * Note, for now, just redirecting to a standard section page until we have video section pages
 * This redirect to video.ft.com - need to remove redirect
 *
 *  - analysis-review
 *  - authers-note
 *  - ft-world
 *  - luce-talk
 */
const sectionMapping = {
	companies: '/companies',
	firstft: '/firstft',
	lex: '/lex',
	'life-and-arts': 'life-arts',
	markets: '/markets',
	'the-a-list': '/the-a-list',
	world: '/world'
};

module.exports = (req, res) => {
	res.nextMetricsName = 'section';
	const { 0: section } = req.params;
	const mapTo = sectionMapping[section];

	if (mapTo) {
		logger.info({ event: 'KNOWN_SECTION', section, map_to: mapTo });
		res.redirect(sectionMapping[section]);
	} else {
		logger.warn({ event: 'UNKNOWN_SECTION', section });
		res.redirect('/videos');
	}
};
