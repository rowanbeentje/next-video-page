const logger = require('@financial-times/n-logger');
const teaserFragments = require('@financial-times/n-teaser').fragments;
const createError = require('http-errors');
const querystring = require('querystring');

const hubQuery = require('../../config/queries/hub');
const queryFragments = require('../../config/fragments');

class HubPoller {

	constructor ({ refreshInterval = 60 } = {}) {
		this.refreshInterval = refreshInterval * 1000;
		this.data = null;
		this.currentFetch = null;
	}

	start () {
		this.update();
		setInterval(this.update.bind(this), this.refreshInterval);
	}

	update () {
		if (this.currentFetch) {
			return this.currentFetch;
		}
		const qs = querystring.stringify({
			query: `
				${teaserFragments.teaserExtraLight}
				${teaserFragments.teaserLight}
				${teaserFragments.teaserStandard}
				${teaserFragments.teaserHeavy}
				${queryFragments.sliceContent}
				${queryFragments.teaserContent}

				${hubQuery}
			`,
			variables: JSON.stringify({
				limit: 8
			}),
			source: 'next-video-page'
		});
		return this.currentFetch = fetch(`https://next-api.ft.com/v1/query?${qs}`, {
			timeout: 3000,
			headers: {
				'X-Api-Key': process.env.NEXT_API_KEY
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return response.text()
						.then(text => {
							throw createError(response.status, text);
						});
				}
			})
			.catch(logger.error)
			.then(data => {
				this.currentFetch = null;
				if (data) {
					this.data = data;
				}
				return this.data;
			});
	}

	getData () {
		// if we have data, use that, otherwise wait for the current request to return
		return this.data ? Promise.resolve(this.data) : this.update();
	}

}

const hubPoller = new HubPoller();

module.exports = hubPoller;
