import { bootstrap } from 'n-ui';
import { lazyLoad as lazyLoadImages } from 'n-image';
import OVideo from 'o-video';

import nUiConfig from './n-ui-config';
import Carousel from './components/carousel/carousel';
import carouselFetcher from './components/carousel/fetcher';

bootstrap(nUiConfig, () => {
	OVideo.init();
	lazyLoadImages();

	[...document.querySelectorAll('.js-carousel')]
		.map(carouselEl => {
			const carouselId = carouselEl.getAttribute('id');
			const fetcher = carouselFetcher(carouselId);
			return new Carousel(carouselEl, { fetcher });
		});
});
