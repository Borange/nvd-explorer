export const formatDateString = (isoDate: string) => {
	if (!isoDate || isNaN(Date.parse(isoDate))) {
		return '-';
	}
	return isoDate.split('T')[0];
};
