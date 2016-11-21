import { bootstrap } from 'n-ui';
import nUiConfig from './n-ui-config';
import { lazyLoad as lazyLoadImages } from 'n-image';
import OVideo from 'o-video';

bootstrap(nUiConfig, () => {
	OVideo.init();
	lazyLoadImages();
});
