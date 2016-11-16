import { bootstrap } from 'n-ui';
import nUiConfig from './n-ui-config';
import OVideo from 'o-video';

bootstrap(nUiConfig, () => {
	OVideo.init();
});
