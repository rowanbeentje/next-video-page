module.exports = `
	query ($from: Int!, $limit: Int!) {
		video {
			editorsPicks(from: $from, limit: $limit) {
				...teaserContent
			}
		}
	}
`;
