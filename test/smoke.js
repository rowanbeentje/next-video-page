module.exports = [{
	https: true,
	urls: {
		'/video': 200,
		'/video/5220807225001': {
			status: 301,
			redirect: '/content/c382002a-a839-366c-9b5f-c3e51a25e05d'
		},
		'/video/5220807225001/Trumps-mixed-message/World': {
			status: 301,
			redirect: '/content/c382002a-a839-366c-9b5f-c3e51a25e05d'
		},
		'/video/12345': {
			status: 302,
			redirect: '/video'
		},
		'/video/world': {
			status: 302,
			redirect: '/world'
		},
		'/video/luce-talk': {
			status: 302,
			redirect: '/video'
		}
	}
}];
