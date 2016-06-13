import TelegramBot from 'node-telegram-bot-api';
import request from 'request';
import moment from 'moment';
import { TELEGRAM, VK } from '../configs/token';

const botOptions = {
	polling: true
};
var bot = new TelegramBot(TELEGRAM.token, botOptions);

bot.getMe().then(function(me) {
	console.log('Hello! My name is %s!', me.first_name);
	console.log('My id is %s.', me.id);
	console.log('And my username is @%s.', me.username);
});

bot.on('text', function(msg) {
	let messageChatId = msg.chat.id;
	let messageText = msg.text;
	let messageDate = msg.date;
	let messageUsr = msg.from.username;

	console.log(msg);

	const command = '/party ';

	let response = 'Hello, ' + messageUsr;
	let date = getDateFromTimestamp(messageDate);

	if (messageText === command + 'today') {

	} else if (messageText.includes(command)) {
		date = messageText.replace(command);
	}
	date = normalizeDate(date);
	console.log(date)
	response = getGroups(date);
	console.log(response)
	sendMessageByBot(messageChatId, response);
});

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
		'access_token': VK.my_token
	};
	let string = r.date;
	let url = 'https://api.vk.com/method/' + r.method + '?q=' + string + '&future=' + r.future + '&country_id=' + r.country_id + '&city_id=' + r.city_id + '&type=' + r.type + '&access_token=' + r.access_token;
	let my_response = "Let's party!";

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			my_response = JSON.parse(body);
			my_response = my_response.response;

			if (my_response[0] > 0) {
				my_response = my_response[1].name;
			} else {
				my_response = "No parties that day :(";
			}
		}
	});

	return my_response; // Проблема асинхронности. Сделать колбэки или промизы
};
