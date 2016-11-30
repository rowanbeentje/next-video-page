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
		this.updateButtons();
	}

	getCarouselWidth () {
		return this.carouselItemsEl.offsetWidth;
	}

	getItemWidth () {
		return this.getItems()[0].offsetWidth;
	}

	getItems () {
		return [...this.carouselItemsEl.querySelectorAll('.carousel__item')];
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
		if (
			(this.position === 0 && direction === 'previous') ||
			(this.position === (this.getNumberItems() - 1) && direction === 'next')
		) {
			return;
		} else {
			const newPosition = this.position + (this.getNumberVisibleItems() * (direction === 'next' ? 1 : -1));
			this.position = clamp(newPosition, 0, this.lastPagePosition());
			this.offset = this.getItems()[this.position].offsetLeft + 1;
			// this.offset = this.position * this.getCarouselWidth();
			this.carouselItemsEl.style.transform = `translate(-${this.offset}px)`;
			this.loadMoreItems();
		}
	}

	loadMoreItems () {
		this.disableButton('next');
		this.fetcher(this)
			.then((items = []) => {
				items.forEach(this.addItem.bind(this));
				this.updateButtons();
			});
	}

	addItem (itemData) {
		const carouselItemEl = document.createElement('div');
		carouselItemEl.classList.add('carousel__item');
		carouselItemEl.setAttribute('data-o-grid-colspan', '12 S6 L4 XL3');
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

	toggleButton (direction, state) {
		this[`${state}Button`](direction);
	}

	updateButtons () {
		this.toggleButton('previous', this.position === 0 ? 'disable' : 'enable');
		this.toggleButton('next', this.position === this.lastPagePosition() ? 'disable' : 'enable');
	}

	lastPagePosition () {
		return this.getNumberItems() - this.getNumberVisibleItems();
	}

}

export default Carousel;
