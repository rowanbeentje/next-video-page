import nTeaserHeavyTemplate from '../../../bower_components/n-teaser/templates/heavy.html';
import { lazyLoad as lazyLoadImages } from 'n-image';
import { init as oDateInit } from 'o-date';

const addArrow = function (el, direction) {
	const arrowEl = document.createElement('button');
	arrowEl.classList.add('carousel-arrow', `carousel-arrow--${direction}`);
	arrowEl.setAttribute('data-trackable', direction);
	arrowEl.addEventListener('click', this.move.bind(this, direction));
	el.parentNode.appendChild(arrowEl);
	return arrowEl;
};

const clamp = (number, lower, upper) => Math.min(Math.max(number, lower), upper);

class Carousel {

	constructor (carouselEl, { fetcher } = {}) {
		this.carouselEl = carouselEl;
		this.carouselInnerEl = carouselEl.querySelector('.carousel-inner');
		this.fetcher = fetcher;
		this.position = 0;
		this.offset = 0;
		const addArrowToCarousel = addArrow.bind(this, this.carouselEl);
		['previous', 'next'].map(addArrowToCarousel);
		carouselEl.setAttribute('data-carousel-js', '');
	}

	getCarouselWidth () {
		return this.carouselInnerEl.offsetWidth;
	}

	getItemWidth () {
		return this.getItems()[0].offsetWidth;
	}

	getItems () {
		return [...this.carouselInnerEl.querySelectorAll('.carousel__item')];
	}

	getNumberItems () {
		return this.getItems().length;
	}

	getNumberVisibleItems () {
		const carouselWidth = this.getCarouselWidth();
		const carousleItemWidth = this.getItems()[0].offsetWidth;
		return Math.round(carouselWidth / carousleItemWidth);
	}

	move (direction) {
		if (this.offset === 0 && direction === 'previous') {
			return;
		}
		const newPosition = this.position + (this.getNumberVisibleItems() * (direction === 'next' ? 1 : -1));
		const positionUpperBound = this.getNumberItems() - this.getNumberVisibleItems();
		this.position = clamp(newPosition, 0, positionUpperBound);
		this.offset = this.position * this.getItemWidth();
		this.carouselInnerEl.style.transform = `translate(-${this.offset}px)`;
		this.loadMoreItems();
	}

	loadMoreItems () {
		this.fetcher(this)
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
