import { WHEN, COMMANDS } from '../configs/constants';

export default function parse(msg, locale) {
	const today = new Date();
	var DATA = {
		dates: [],
		help: false,
	};

	var words = msg.replace(/\s\s+/g, ' ') // replace multitabs with tabs
		.split(/,|\.|_|\t|\n|\r|\s/g); // array of splitted words

	for (let i = 0; i < words.length; i++) {
		let date = '';

		if (Number.isInteger(words[i]*1) &&
				(words[i]*1 > 0) &&
				(words[i]*1 < 32) &&
				(i !== words.length - 1) &&
				isOneOf(words[i+1], WHEN[locale].months)
		) {
			date = words[i] + ' ' + words[i+1];
		} else if (isOneOf(words[i], WHEN[locale].today)) {
			date = today.getDate() + ' ' + WHEN[locale].months_full[today.getMonth()];
		} else if (isOneOf(words[i], WHEN[locale].tomorrow)) {
			date = 'tomorrow';
		} else if (isOneOf(words[i], WHEN[locale].weekend)) {
			date = 'weekend';
		} else if (isOneOf(words[i], WHEN[locale].dayaftertomorrow)) {
			date ='dayaftertomorrow';
		} else if (words[i] === COMMANDS.help){
			DATA.help = true;
		}

		if (date) {
			DATA.dates.push(encodeURI(date));
		}
	};

	return DATA;
};

function isOneOf(word, array) {
	return array.some(is);

	function is(_word) {
		let re = new RegExp('^' + _word);

		return re.test(word);
	};
};
