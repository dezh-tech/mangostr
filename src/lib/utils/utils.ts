export function shortenString(str: string | undefined) {
	if (str == undefined || str == '') {
		return '';
	}

	if (str.length == 1 || str.length == 2) {
		return str;
	}

	const start = str.slice(0, 8);
	const end = str.slice(-8);
	return `${start}:${end}`;
}

export function formatDate(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const hh = String(date.getHours()).padStart(2, '0');
	const min = String(date.getMinutes()).padStart(2, '0');
	const sec = String(date.getSeconds()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
}
