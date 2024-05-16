const removeNullsAndUndefined = (obj) => {
	for (const key in obj) {
		if (obj[key] === null || obj[key] === undefined) {
			delete obj[key];
		}
	}
};

const makeDate = (date) => {
	if (!date) {
		return null;
	}
	const { __typename, ...newDate } = date;
	return JSON.stringify(newDate);
};

module.exports = { removeNullsAndUndefined, makeDate };
