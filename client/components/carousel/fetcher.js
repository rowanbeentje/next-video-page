import * as queries from '../../../config/queries';
import { teaserContent as teaserContentFragment } from '../../../config/fragments';
import { stringify } from '../../utils/querystring';

const carouselFetcher = carouselId => {
	let query;
	const variables = {};
	if (queries[carouselId]) {
		query = queries[carouselId];
	} else { // assume it's a section carousel
		query = queries.section;
		variables.tag = carouselId;
	}

	return carousel => {
		const from = carousel.position + carousel.getNumberVisibleItems();
		const limit = from + carousel.getNumberVisibleItems() - carousel.getNumberItems();
		if (limit <= 0) {
			return Promise.resolve();
		}
		const qs = {
			query: encodeURIComponent(`
				${teaserContentFragment}

				${query}`
			),
			variables: JSON.stringify(Object.assign({}, variables, { from, limit })),
			source: 'next-video-page-carousel'
		};

		return fetch(`https://next-api.ft.com/v1/query?${stringify(qs)}`, {
			timeout: 3000
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return response.text()
						.then(text => {
							throw new Error(`Unable to fetch carousel items: ${text}`);
						});
				}
			})
			.then(({ data }) => {
				switch (carouselId) {
					case 'latest':
						return data.latest;
					case 'editors-picks':
						return data.video.editorsPicks;
					case 'popular':
						return data.video.popular;
					default:
						return data.section.videos;
				}
			});
	};
};

export default carouselFetcher;
