const query = id => {
	return `
	fragment sliceContent on Tag {
		prefLabel
		relativeUrl
		contentCount
		latestContent(limit: 4, type: Video) {
			...teaserContent
		}
	}
	fragment teaserContent on Content {
		id
		title
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
	}
	{
		video {
			${
				id ?
				`video(id: "${id}") {
					id
					title
				}` :
				`video: editorsPicks(limit: 1) {
					id
					title
				}`
			}
			editorsPicks(limit: 4) {
				id
				title
				duration
				image {
					src: rawSrc
				}
			}
		}
		markets: tag(id: "NzE=-U2VjdGlvbnM=") {
			...sliceContent
		}
		world: tag(id: "MQ==-U2VjdGlvbnM=") {
			...sliceContent
		}
		companies: tag(id: "Mjk=-U2VjdGlvbnM=") {
			...sliceContent
		}
		lifeAndArts: tag(id: "MTQ4-U2VjdGlvbnM=") {
			...sliceContent
		}
	}`;
};

module.exports = (req, res, next) => {
	res.nextMetricsName = 'video';
	const id = req.params.id;
	fetch(`https://next-api.ft.com/v1/query?query=${query(id)}&source=next-video-page`, {
		timeout: 3000,
		headers: {}
	})
		.then(response => response.json())
		.then(({ data: { video: videos = {}, markets, companies, world, lifeAndArts } = {} } = {}) => {
			const video = Array.isArray(videos.video) ? videos.video[0] : videos.video;
			const sliceData = [markets, companies, world, lifeAndArts].map(tag => ({
				title: tag.prefLabel,
				url: tag.relativeUrl,
				videoCount: tag.contentCount,
				videos: tag.latestContent
			}));
			const slices = [
				{
					title: 'Editor‘s Picks',
					videos: videos.editorsPicks
				},
				...sliceData
			];
			res.render('video', {
				layout: 'wrapper',
				title: `Financial Times | Video | ${video.title}`,
				video,
				slices
			});
		})
		.catch(next);
};
