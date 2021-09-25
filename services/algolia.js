const algoliasearch = require("algoliasearch");

const client = algoliasearch(
	process.env.ALGOLIA_APP_ID,
	process.env.ALGOLIA_API_KEY
);

class Algolia {
	static add = async (newIndex, payload) => {
		try {
			const index = client.initIndex(newIndex);
			const data = await index.saveObject(payload);
			return data;
		} catch (error) {
			throw error;
		}
	};

	static remove = async (newIndex, payload) => {
		try {
			const index = client.initIndex(newIndex);
			const data = await index.deleteObject(payload);
			return data;
		} catch (error) {
			throw error;
		}
	};
}

module.exports = Algolia;
