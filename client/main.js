import { bootstrap } from 'n-ui';
import { lazyLoad as lazyLoadImages } from 'n-image';
import OVideo from 'o-video';

import nUiConfig from './n-ui-config';
import Carousel from './components/carousel';

bootstrap(nUiConfig, () => {
	OVideo.init();
	lazyLoadImages();

	const carousels = [...document.querySelectorAll('.js-carousel')]
		.map(carouselEl => {
			return new Carousel(carouselEl);
		});
});
