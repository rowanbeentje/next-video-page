module.exports = [{
	https: true,
	urls: {
		'/videos': 200,
		'/videos/5220807225001': {
			status: 301,
			redirect: '/content/c382002a-a839-366c-9b5f-c3e51a25e05d'
		},
		'/videos/5220807225001/Trumps-mixed-message/World': {
			status: 301,
			redirect: '/content/c382002a-a839-366c-9b5f-c3e51a25e05d'
		},
		'/videos/12345': {
			status: 302,
			redirect: '/videos'
		}
	}
}];
