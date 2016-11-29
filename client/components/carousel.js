import nTeaserHeavyTemplate from 'n-teaser/templates/heavy.html';

import { stringify } from '../utils/querystring';

const addArrow = function (el, direction) {
	const arrowEl = document.createElement('button');
	arrowEl.classList.add('carousel-arrow', `carousel-arrow--${direction}`);
	arrowEl.setAttribute('data-trackable', direction);
	arrowEl.addEventListener('click', this.move.bind(this, direction));
	el.appendChild(arrowEl);
	return arrowEl;
};

class Carousel {

	constructor (carouselEl) {
		this.carouselEl = carouselEl;
		this.carouselInnerEl = carouselEl.querySelector('.carousel-inner');
		this.position = 0;
		this.offset = 0;
		const addArrowToCarousel = addArrow.bind(this, this.carouselEl);
		['previous', 'next'].map(addArrowToCarousel);
		carouselEl.setAttribute('data-carousel-js', '');
	}

	getCarouselWidth () {
		return this.carouselInnerEl.offsetWidth;
	}

	getNumberItems () {
		return this.carouselInnerEl.querySelectorAll('.carousel__item').length;
	}

	getNumberVisibleItems () {
		const carouselWidth = this.getCarouselWidth();
		const carousleItemWidth = this.carouselInnerEl.querySelector('.carousel__item').offsetWidth;
		return Math.round(carouselWidth / carousleItemWidth);
	}

	move (direction) {
		if (this.offset === 0 && direction === 'previous') {
			return;
		}
		// get the amount (and direction) to move the carousel
		const carouselVector = this.getCarouselWidth() * (direction === 'next' ? -1 : 1);
		this.offset = Math.min(0, this.offset + carouselVector);
		this.position = Math.max(0, this.position + (this.getNumberVisibleItems() * (direction === 'next' ? 1 : -1)));
		this.carouselInnerEl.style.transform = `translate(${this.offset}px)`;
		this.loadMoreItems();
	}

	loadMoreItems () {
		const from = this.position + this.getNumberVisibleItems();
		const limit = Math.min(this.getNumberVisibleItems(), from + this.getNumberVisibleItems() - this.getNumberItems());
		if (limit <= 0) {
			return;
		}
		const query = `
			fragment teaserContent on Content {
				title
				url: relativeUrl
				lastPublished
				tag: teaserTag {
					url
					name
				}
				genreTag {
					prefLabel
				}
				image: mainImage {
					src: rawSrc
					width
					height
					ratio
				}
				... on Video {
					duration
				}
			}
	
			query ($tagId: String!, $from: Int!, $limit: Int!) {
				tag(id: $tagId) {
					videos: latestContent(from: $from, limit: $limit, type: Video) {
						...teaserContent
					}
				}
			}
		`;
		const variables = {
			from: from,
			limit: limit,
			tagId: 'MTQ4-U2VjdGlvbnM='
		};
		const qs = {
			query: encodeURIComponent(query),
			variables: JSON.stringify(variables),
			source: 'next-video-page-carousel'
		};

		fetch(`https://next-api.ft.com/v1/query?${stringify(qs)}`, {
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
			.then(({ data: { tag: { videos = [] } = {} } }) => {
				videos.forEach(this.addItem.bind(this));
			});
	}

	addItem (data) {
		const carouselItemEl = document.createElement('div');
		carouselItemEl.classList.add('carousel__item');
		carouselItemEl.setAttribute('data-o-grid-colspan', '6 L3');
		const templateData = Object.assign({}, data, {
			mods: ['small', 'stacked'],
			position: { default: 'bottom' }
		});
		carouselItemEl.innerHTML = nTeaserHeavyTemplate(templateData);
		this.carouselInnerEl.appendChild(carouselItemEl);
		return carouselItemEl;
	};

}

export default Carousel;
