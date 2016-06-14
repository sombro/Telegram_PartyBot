import TelegramBot from 'node-telegram-bot-api';
import rp from 'request-promise';
import moment from 'moment';
import { TELEGRAM, VK } from '../configs/token';

const botOptions = {
	polling: true
};
var bot = new TelegramBot(TELEGRAM.token, botOptions);

bot.getMe().then(me => {
	console.log('Hello! My name is %s!', me.first_name);
	console.log('My id is %s.', me.id);
	console.log('And my username is @%s.', me.username);
});

bot.on('text', msg => {
	let messageChatId = msg.chat.id;
	let messageText = msg.text;
	let messageDate = msg.date;
	let messageUsr = msg.from.username;

	const command = '/party ';

	console.log(msg);
	if (messageText.includes(command)) {
		checkDate(messageText, messageDate, command).then(date => {
			return getGroups(date);
		}).then(response => {
			sendMessageByBot(messageChatId, response);
		});
	} else if (messageText === '/help' || messageText === '/party') {
		sendMessageByBot(messageChatId, "Send '/party today' to find today parties. Send '/party <18 июня>' to find party in a certain day.");
	} else {
		sendMessageByBot(messageChatId, "Hi, " + messageUsr + "! Send /help to see what I can!");
	}
});

function checkDate(messageText, messageDate, command) {
	let date = getDateFromTimestamp(messageDate);

	if (messageText === command + 'today') {
		date = normalizeDate(date);
	} else if (messageText.includes(command)) {
		date = encodeURI(messageText.replace(command, ''));
	}

	return Promise.resolve(date);
};

function getDateFromTimestamp(timestamp) {
	return moment(timestamp*1000);
};

function normalizeDate(date) {
	const options = {
		locale: 'ru',
		format: 'D MMMM',
	};

	moment.locale(options.locale);
	date = date.format(options.format);
	date = encodeURI(date);

	return date;
};

function sendMessageByBot(aChatId, aMessage) {
	bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
};

function getGroups(date) {
	let r = {
		'method': 'groups.search',
		'date': date,
		'type': 'event',
		'country_id': 1,
		'city_id': 119,
		'future': 1,
		'access_token': VK.access_token
	};
	let string = r.date;
	let url = 'https://api.vk.com/method/' + r.method + '?q=' + string + '&future=' + r.future + '&country_id=' + r.country_id + '&city_id=' + r.city_id + '&type=' + r.type + '&access_token=' + r.access_token;
	let my_response = "Let's party!";

	return rp(url).then(htmlString => {
		my_response = JSON.parse(htmlString);
		console.log(my_response)
		if (my_response.error) {
			if (my_response.error.error_code === 5) {
				// get new access_token
			}
			console.log(my_response.error.error_msg);
			return "Sorry! Party Bot is temporary unavailable. Try again later."
		} else {
			my_response = my_response.response;

			if (my_response[0] > 0) {
				my_response = my_response[1].name + ' https://new.vk.com/' + my_response[1].screen_name;
				return my_response;
			} else {
				return "No parties that day :(";
			}
		}
	}).catch(err => {
		console.log(err);
	});
};
