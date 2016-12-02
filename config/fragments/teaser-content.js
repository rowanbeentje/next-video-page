module.exports = `
	fragment teaserContent on Content {
		...TeaserExtraLight
		...TeaserLight
		...TeaserStandard
		...TeaserHeavy
		...on Video {
			duration
		}
	}
`;
