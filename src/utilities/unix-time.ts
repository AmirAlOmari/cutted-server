export const unixTime = (timestamp: number | string): string => {
	const a: Date = new Date(timestamp);
	const months: Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const year: number | string = a.getFullYear();

	let month: number | string = months[a.getMonth()];
	if (month.toString().length < 2) {
		month = "0" + month.toString();
	}

	let date: number | string = a.getDate();
	if (date.toString().length < 2) {
		date = "0" + date.toString();
	}

	let hour: number | string = a.getHours();
	if (hour.toString().length < 2) {
		hour = "0" + hour.toString();
	}

	let min: number | string = a.getMinutes();
	if (min.toString().length < 2) {
		min = "0" + min.toString();
	}

	let sec: number | string = a.getSeconds();
	if (sec.toString().length < 2) {
		sec = "0" + sec.toString();
	}

	let ms: number | string = a.getMilliseconds();
	if (ms.toString().length < 2) {
		ms = "00" + ms.toString();
	} else if (ms.toString().length < 3) {
		ms = "0" + ms.toString();
	}

	return `[${date} ${month} ${year} ${hour}:${min}:${sec}.${ms}]`;
};
