module.exports = (req, res, next) => {
	res.nextMetricsName = 'hub';
	const query = `{
		video {
			video: editorsPicks(limit: 1) {
				id
				title
			}
			editorsPicks(limit: 4) {
				id
				title
				image {
					rawSrc
				}
			}
			world: section(id: "MQ==-U2VjdGlvbnM=", limit: 4) {
				id
				title
				image {
					rawSrc
				}
			}
			lex: section(id: "MTE1-U2VjdGlvbnM=", limit: 4) {
				id
				title
				image {
					rawSrc
				}
			}
			companies: section(id: "Mjk=-U2VjdGlvbnM=", limit: 4) {
				id
				title
				image {
					rawSrc
				}
			}
		}
	}`;

	fetch(`https://next-api.ft.com/v1/query?query=${query}&source=next-video-page`, {
		timeout: 3000,
		headers: {}
	})
		.then(response => response.json())
		.then(({ data: { video: videos = {} } = {} } = {}) => {
			const video = videos.video[0];
			const sections = [
				{
					title: 'Editor‘s Picks',
					videos: videos.editorsPicks
				},
				{
					title: 'World',
					videos: videos.world
				},
				{
					title: 'Lex',
					videos: videos.lex
				},
				{
					title: 'Companies',
					videos: videos.companies
				}
			];
			res.render('video', {
				layout: 'wrapper',
				title: 'Financial Times | Video',
				video,
				sections
			});
		})
		.catch(next);
};
