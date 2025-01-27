export function shortenString(str: string | undefined) {
	if (str == undefined) {
		return '';
	}

	const start = str.slice(0, 8);
	const end = str.slice(-8);
	return `${start}:${end}`;
}
