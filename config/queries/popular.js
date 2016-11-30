module.exports = `
	query ($from: Int!, $limit: Int!) {
		video {
			popular(from: $from, limit: $limit) {
				...teaserContent
			}
		}
	}
`;
