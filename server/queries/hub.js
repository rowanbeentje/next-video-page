module.exports = {
	query: `
		fragment sliceContent on Tag {
			title: prefLabel
			url: relativeUrl
			videos: latestContent(limit: $limit, type: Video) {
				...teaserContent
			}
		}

		fragment teaserContent on Content {
			title
			url: relativeUrl
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

		query ($limit: Int!) {
			video {
				highlight: editorsPicks(limit: 1) {
					bodyHTML
					...teaserContent
				}
				editorsPicks(from: 1, limit: $limit) {
					...teaserContent
				}
				popular(limit: $limit) {
					...teaserContent
				}
			}
			latestVideos: latestContent(limit: $limit, type: Video ) {
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
	`,
	variables: { limit: 8 }
};
