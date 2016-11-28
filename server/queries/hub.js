module.exports = `
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
		... on Video {
			duration
		}
	}

	{
		video {
			highlight: editorsPicks(limit: 1) {
				bodyHTML
				...teaserContent
			}
			editorsPicks(from: 1, limit: 4) {
				...teaserContent
			}
			popular(limit: 4) {
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
