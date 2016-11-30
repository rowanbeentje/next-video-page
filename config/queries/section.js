module.exports = `
	query ($tag: String!, $from: Int!, $limit: Int!) {
		section: tag(id: $tag) {
			videos: latestContent(from: $from, limit: $limit, type: Video) {
				...teaserContent
			}
		}
	}
`;
