const axios = require("axios");

class Netlify {
	static buildHook = async () => {
		try {
			const { data } = await axios({
				method: "POST",
				url: `${process.env.NETLIFY_API_URL}/build_hooks/${process.env.NETLIFY_WEBHOOK_KEY}`,
				data: {},
			});
			return data;
		} catch (error) {
			throw {
				name: "NetlifyErr",
				message: error.response.data,
				code: error.response.status,
			};
		}
	};
}

module.exports = Netlify;
