module.exports = `
	fragment sliceContent on Tag {
		title: prefLabel
		id: idV1
		url: relativeUrl
		videos: latestContent(from: $from, limit: $limit, type: Video) {
			...teaserContent
		}
	}
`;
