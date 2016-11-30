module.exports = `
	query ($from: Int, $limit: Int!) {
		video {
			hero: editorsPicks(limit: 1) {
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
		latest: latestContent(limit: $limit, type: Video ) {
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
