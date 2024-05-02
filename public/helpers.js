const normalizeDate = (date) => {
	if (!date) return "no date found";
	if (date[0] !== "{") return date;
	date = JSON.parse(date);
	return `${date.month}/${date.day}/${date.year}`;
};
export { normalizeDate };
