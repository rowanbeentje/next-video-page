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
		world: tag(id: "MQ==-U2VjdGlvbnM=") {
			...sliceContent
		}
		markets: tag(id: "NzE=-U2VjdGlvbnM=") {
			...sliceContent
		}
		opinion: tag(id: "MTE2-U2VjdGlvbnM=") {
			...sliceContent
		}
		ftFeatures: tag(id: "OGZmYTY5OWEtNjhmNy00NjQ4LTlhYzUtNGZhNjczNTIyNDc0-QnJhbmRz") {
			...sliceContent
		}
		companies: tag(id: "Mjk=-U2VjdGlvbnM=") {
			...sliceContent
		}
		lex: tag(id: "YzhlNzZkYTctMDJiNy00NTViLTk3NmYtNmJjYTE5NDEyM2Yw-QnJhbmRz") {
			...sliceContent
		}
		lifeAndArts: tag(id: "MTQ4-U2VjdGlvbnM=") {
			...sliceContent
		}
		workAndCareers: tag(id: "MTI1-U2VjdGlvbnM=") {
			...sliceContent
		}
	}
`;
