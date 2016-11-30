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

const clamp = (number, lower, upper) => Math.min(Math.max(number, lower), upper);

class Carousel {

	constructor (carouselEl, { fetcher } = {}) {
		this.carouselEl = carouselEl;
		this.carouselInnerEl = this.carouselEl.querySelector('.carousel-inner');
		this.carouselItemsEl = this.carouselEl.querySelector('.carousel__items');
		this.fetcher = fetcher;
		this.position = 0;
		this.offset = 0;
		const addArrowToCarousel = addArrow.bind(this, this.carouselInnerEl);
		['previous', 'next'].map(addArrowToCarousel);
		this.carouselEl.setAttribute('data-carousel-js', '');
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
		console.log('#### MOVE');
		if (this.offset === 0 && direction === 'previous') {
			return;
		}
		const newPosition = this.position + (this.getNumberVisibleItems() * (direction === 'next' ? 1 : -1));
		const positionUpperBound = this.getNumberItems() - this.getNumberVisibleItems();
		this.position = clamp(newPosition, 0, positionUpperBound);
		this.offset = this.position * this.getItemWidth();
		this.carouselItemsEl.style.transform = `translate(-${this.offset}px)`;
		this.loadMoreItems();
	}

	loadMoreItems () {
		this.disableButton('next');
		this.fetcher(this)
			.then((items = []) => {
				items.forEach(this.addItem.bind(this));
				this.enableButton('next');
			});
	}

	addItem (itemData) {
		const carouselItemEl = document.createElement('div');
		carouselItemEl.classList.add('carousel__item');
		carouselItemEl.setAttribute('data-o-grid-colspan', '6 L3');
		const templateData = Object.assign({}, itemData, {
			mods: ['small', 'stacked', 'video'],
			position: { default: 'bottom' }
		});
		carouselItemEl.innerHTML = nTeaserHeavyTemplate(templateData);
		this.carouselItemsEl.appendChild(carouselItemEl);
		lazyLoadImages(carouselItemEl);
		oDateInit(carouselItemEl);
		return carouselItemEl;
	}

	disableButton (direction) {
		this.carouselEl.querySelector(`.carousel-arrow--${direction}`).setAttribute('disabled', '');
	}

	enableButton (direction) {
		this.carouselEl.querySelector(`.carousel-arrow--${direction}`).removeAttribute('disabled');
	}

}

export default Carousel;
