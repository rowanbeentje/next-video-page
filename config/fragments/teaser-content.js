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
		genreTag {
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
