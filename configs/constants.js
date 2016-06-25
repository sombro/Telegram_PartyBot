export const MESSAGES = {
	ru: {
		help: 'Напиши мне, когда хочешь тусить и я помогу тебе найти вечеринку по вкусу!',
		hi: 'Привет',
		send: 'Отправь ',
		whatICan: ' чтобы увидеть, что я умею!',
		unavailable: 'Извините! Party Bot временно недоступен. Попробуйте написать позже.',
		noParties: 'В этот день нет вечеринок :(',
	},
	en: {
		help: 'Write, when you would like to party and I will help you to find the best party!',
		hi: 'Hi',
		send: 'Send ',
		whatICan: ' to see what I can!',
		unavailable: 'Sorry! Party Bot is temporary unavailable. Try again later.',
		noParties: 'No parties that day :(',
	},
};

export const COMMANDS = {
	help: '/help',
	party: '/party',
};

export const PARTY_TYPES = {
	ru: ['театр', 'кино', 'концерт', 'клуб', 'бассейн', 'аквапарк', 'вечеринка'],
};

export const WHEN = {
	ru: {
		months: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
		months_full: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
		today: ['сегодня', 'сёдня', 'седня', 'нынче'],
		tomorrow: ['завтра'],
		dayaftertomorrow: ['послезавтра'],
		weekend: ['выходны'],
	},
	en: {
		today: ['today'],
		tomorrow: ['tomorrow'],
		weekend: ['weekend'],
	},
};
