import nTeaserHeavyTemplate from '../../../bower_components/n-teaser/templates/heavy.html';
import { lazyLoad as lazyLoadImages } from 'n-image';
import { init as oDateInit } from 'o-date';

const addArrow = function (el, direction) {
	const arrowEl = document.createElement('button');
	arrowEl.classList.add('carousel-arrow', `carousel-arrow--${direction}`);
	arrowEl.setAttribute('data-trackable', direction);
	arrowEl.addEventListener('click', this.move.bind(this, direction));
	el.appendChild(arrowEl);
	return arrowEl;
};

class Carousel {

	constructor (carouselEl, { fetcher } = {}) {
		this.carouselEl = carouselEl;
		this.fetcher = fetcher;
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

	getCarouselItems () {
		return [...this.carouselInnerEl.querySelectorAll('.carousel__item')];
	}

	getNumberItems () {
		return this.getCarouselItems().length;
	}

	getNumberVisibleItems () {
		const carouselWidth = this.getCarouselWidth();
		const carousleItemWidth = this.getCarouselItems()[0].offsetWidth;
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
		this.fetcher(this, from, limit)
			.then((items = []) => {
				items.forEach(this.addItem.bind(this));
			});
	}

	addItem (itemData) {
		const carouselItemEl = document.createElement('div');
		carouselItemEl.classList.add('carousel__item', 'carousel__item--inactive');
		carouselItemEl.setAttribute('data-o-grid-colspan', '6 L3');
		const templateData = Object.assign({}, itemData, {
			mods: ['small', 'stacked', 'video'],
			position: { default: 'bottom' }
		});
		carouselItemEl.innerHTML = nTeaserHeavyTemplate(templateData);
		this.carouselInnerEl.appendChild(carouselItemEl);
		lazyLoadImages(carouselItemEl);
		oDateInit(carouselItemEl);
		return carouselItemEl;
	}

}

export default Carousel;
