import TelegramBot from 'node-telegram-bot-api';
import rp from 'request-promise';
import { TELEGRAM, VK } from '../configs/token';
import { MESSAGES, COMMANDS } from '../configs/constants';
import parse from './parser';

const LOCALE = 'ru';
const BOT_OPTIONS = {
	polling: true
};

var bot = new TelegramBot(TELEGRAM.token, BOT_OPTIONS);

bot.getMe().then(me => {
	console.log('Hello! My name is %s!', me.first_name);
	console.log('My id is %s.', me.id);
	console.log('And my username is @%s.', me.username);
	console.log('');
});

bot.on('text', msg => {
	console.log(msg)

	var messageChatId = msg.chat.id;
	var messageText = msg.text;
	var messageUsr = msg.from.username;

	var data = parse(messageText, LOCALE);

	if (data.help) {
		sendMessageByBot(messageChatId, MESSAGES[LOCALE].help);
	} else if (data.dates.length > 0) {
		getGroupsFromVK(data.dates[0], VK).then(response => {
			sendMessageByBot(messageChatId, response);
		});
	} else {
		sendMessageByBot(messageChatId, MESSAGES[LOCALE].hi + ", " + messageUsr + "! " + MESSAGES[LOCALE].send + COMMANDS.help + MESSAGES[LOCALE].whatICan);
	}
});

function sendMessageByBot(aChatId, aMessage) {
	bot.sendMessage(aChatId, aMessage);
};

function getGroupsFromVK(date, VK) {
	var r = {
		'method': 'groups.search',
		'date': date,
		'type': 'event',
		'country_id': 1,
		'city_id': 119,
		'future': 1,
		'access_token': VK.access_token
	};
	var string = r.date;
	var url = 'https://api.vk.com/method/' + r.method +
		'?q=' + string +
		'&future=' + r.future +
		'&country_id=' + r.country_id +
		'&city_id=' + r.city_id +
		'&type=' + r.type +
		'&access_token=' + r.access_token;

	return rp(url).then(htmlString => {
		var my_response = JSON.parse(htmlString);
		console.log(my_response);

		if (my_response.error) {
			console.log(my_response.error.error_msg);
			return MESSAGES[LOCALE].unavailable;
		} else {
			my_response = my_response.response;

			if (my_response[0] > 0) {
				my_response = my_response[1].name + ' https://new.vk.com/club' + my_response[1].gid;
				return my_response;
			} else {
				return MESSAGES[LOCALE].noParties;
			}
		}
	}).catch(err => {
		console.log(err);
	});
};
