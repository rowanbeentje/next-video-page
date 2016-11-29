const stringify = qsObject => {
	return Object.keys(qsObject)
		.map(param => `${param}=${qsObject[param]}`)
		.join('&');
};

export {
	stringify
}
