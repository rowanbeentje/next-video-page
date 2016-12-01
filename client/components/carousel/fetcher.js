import { broadcast } from 'n-ui/utils'

import * as queries from '../../../config/queries';
import { teaserContent as teaserContentFragment } from '../../../config/fragments';
import { stringify } from '../../utils/querystring';

const addTeaserType = video => {
	let type = '';
	if (video.isOpinion) {
		type = 'opinion';
	} else if (video.isEditorsChoice) {
		type = 'editors-pick';
	}
	return Object.assign({}, video, { type });
};

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
		const from = Math.min(carousel.position + carousel.getNumberVisibleItems(), carousel.getNumberItems());
		const to = carousel.position + (carousel.getNumberVisibleItems() * 2);
		if (from < carousel.getNumberItems()) {
			return Promise.resolve();
		}
		const qs = {
			query: encodeURIComponent(`
				${teaserContentFragment}

				${query}`
			),
			variables: JSON.stringify(Object.assign({}, variables, {
				// offset editors-picks by one, as the first video goes in the hero slot
				from: (carouselId === 'editors-picks') ? from + 1 : from,
				limit: (carouselId === 'editors-picks') ? to - from + 1 : to - from,
			})),
			source: 'next-video-page-carousel'
		};

		return fetch(`https://next-api.ft.com/v1/query?${stringify(qs)}`, {
			timeout: 3000,
			useCorsProxy: true
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return response.text()
						.then(text => {
							throw new Error(`Fail fetching data from next-api with "${text}" (${response.status})`);
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
			})
			.then(videos => videos.map(addTeaserType))
			.catch(err => {
				broadcast('oErrors.log', {
					error: err,
					info: {
						message: 'Failed fetching data for carousel'
					}
				});
			});
	};
};

export default carouselFetcher;
