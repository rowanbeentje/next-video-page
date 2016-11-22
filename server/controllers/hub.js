const query = `
	fragment sliceContent on Tag {
		prefLabel
		relativeUrl
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
			editorsPicks(limit: 1) {
				bodyHTML
				...teaserContent
			}
		}
		latestVideos: latestContent(limit: 4, type: Video ) {
			...teaserContent
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
	}
`;

const normaliseTag = tag => ({
	title: tag.prefLabel,
	url: tag.relativeUrl,
	videoCount: tag.contentCount,
	videos: tag.latestContent.map(normaliseVideo)
});

const normaliseVideo = video => {
	return Object.assign({}, video, { url: `/content/${video.id}`});
};

module.exports = (req, res, next) => {
	res.nextMetricsName = 'video';
	fetch(`https://next-api.ft.com/v1/query?query=${encodeURIComponent(query)}&source=next-video-page`, {
		timeout: 3000,
		headers: {
			'X-Api-Key': process.env.NEXT_API_KEY
		}
	})
		.then(response => response.json())
		.then(({ data: { video: { editorsPicks: [highlight] } = {}, latestVideos, markets, companies, world, lifeAndArts } = {} } = {}) => {
			const sections = [markets, companies, world, lifeAndArts].map(normaliseTag);
			const slices = [
				{
					title: 'Latest',
					videos: latestVideos.map(normaliseVideo)
				},
				...sections
			];
			res.render('hub', {
				layout: 'wrapper',
				title: `Financial Times | Videos`,
				highlight: normaliseVideo(highlight),
				slices
			});
		})
		.catch(next);
};
