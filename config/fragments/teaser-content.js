module.exports = `
	fragment teaserContent on Content {
		title
		url: relativeUrl
		lastPublished
		isOpinion
		isEditorsChoice
		tag: teaserTag {
			url
			name
		}
		genreTag(only: ["MQ==-R2VucmVz", "Mw==-R2VucmVz", "OQ==-R2VucmVz", "NA==-R2VucmVz", "MTA=-R2VucmVz"]) {
			prefLabel
		}
		image: mainImage {
			url: rawSrc
			width
			height
			ratio
		}
		... on Video {
			duration
		}
	}
`;
