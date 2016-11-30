module.exports = `
	query ($from: Int, $limit: Int!) {
		latest: latestContent(from: $from, limit: $limit, type: Video ) {
			...teaserContent
		}
	}
`;
