/*
  ASIANBOI's Selfbot
  September 23, 2016
  Programmed by Michael Cao (ASIANBOI)
*/

// You will require node.js and discord.js for this bot. To install, download and install node, and then do 'npm i discord.js' in a console window.
var Discord = require('discord.js');
var selfbot = new Discord.Client({
	disableEveryone: true
});

var config = require('./config.json');

// This is the prefix you use to use your own selfbot.
var prefix = config.prefix;

// This is your account's token. It may be found by opening the Discord Console (Ctrl-Shift-I for Windows) and typing in 'localStorage.token'.
// Do not let anyone get your self-token! It can be used to access your account and mess with your settings and servers you have perms in.
// If anyone gets your token, you will need to reset it as soon as possible.
selfbot.login(config.token);

// Type in the word (ex. '<prefix>lenny') and it will output the second string (ex. '( ͡° ͜ʖ ͡°)') You may add more as you need them.
var shortcuts = new Map([
	['lenny', '( ͡° ͜ʖ ͡°)'],
	['shrug', '¯\\_(ツ)_/¯'],
	['justright', '✋😩👌'],
	['tableflip', '(╯°□°）╯︵ ┻━┻'],
	['unflip', '┬──┬ ノ( ゜-゜ノ)'],
	['dance', "(>’-‘)> \n <(‘_'<) \n ^(‘_’)\- \n \m/(-_-)\m/ \n <( ‘-‘)> \n \_( .”)> \n <( ._.)-`"],
	['pistols', '’ ̿’\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/’̿’̿ ̿']
]);

var afk = -1;
var afkmessage;

selfbot.on('error', e => {
	console.error(e);
});

selfbot.on('warn', e => {
	console.warn(e);
});

selfbot.on('debug', e => {
	console.info(e);
});

selfbot.on('ready', function() {
	console.log('Selfbot Online and Ready! On ' + selfbot.guilds.size + ' servers!');
});

selfbot.on('message', message => {
	if (message.content.includes('<@' + selfbot.user.id + '>')) {
		if (afk === 1) {
			message.reply(selfbot.user.username + ' is AFK: ' + afkmessage);
		}
	}
	if (message.channel.type === 'dm') {
		if (afk === 1) {
			message.reply(selfbot.user.username + ' is AFK: ' + afkmessage);
		}
	}
	if (message.author !== selfbot.user) return;
	if (afk === 1) {
		if (!message.content.includes('AFK') && !message.content.startsWith(prefix + 'afk')) {
			message.channel.sendMessage('Welcome back ' + selfbot.user.username + '! I\'ve removed your AFK message.');
			selfbot.user.setStatus('online', 'Online');
			afkmessage = '';
			afk = -1;
		}
	}
	if (!message.content.startsWith(prefix)) return;
	if (message.content.startsWith(prefix + 'afk')) {
		afkmessage = message.content.slice(6);
		afk = true;
		message.channel.sendMessage('Alright ' + selfbot.user.username + ' I\'ve set your AFK message to: `' + afkmessage + '`');
		selfbot.user.setStatus('idle', 'AFK: ' + afkmessage);
	}
	if (message.content.startsWith(prefix + 'restart')) {
		message.channel.sendMessage(':wave: ' + selfbot.user.username + '\'s Selfbot is restarting...');
		setTimeout(function() {
			selfbot.logout()
		}, 1000);
		setTimeout(function() {
			process.exit()
		}, 2000);
	}
	if (message.content.startsWith(prefix + 'prune')) {
		var params = message.content.slice(8);
		let messagecount = parseInt(params);
		message.channel.fetchMessages({
			limit: messagecount
		}).then(messages => {
			messages.map(m => m.delete().catch(console.error));
		}).catch(console.error);
		message.channel.sendMessage(selfbot.user.username + ', successfully pruned ' + params + ' of your messages!')
	}
	var commandName = message.content;
	if (shortcuts.has(commandName)) {
		setTimeout(() => {
			message.edit(shortcuts.get(commandName))
		}, 10);
		return;
	}
	if (message.content.startsWith(prefix + 'servers')) {
		console.log(message.author.username + ' executed: servers');
		message.channel.sendMessage('Servers: ' + selfbot.guilds.size);
	}
	if (message.content.startsWith(prefix + 'setgame')) {
		console.log(message.author.username + ' executed: setgame');
		var game = message.content.split(' ').splice(1).join(' ');
		selfbot.user.setStatus('online', game);
		message.edit('Successfully set game to ' + game);
	}
	if (message.content.startsWith(prefix + 'stats')) {
		console.log(message.author.username + ' executed: stats');
		message.channel.sendMessage('Stats for ' + selfbot.user.username + ': \n``' + selfbot.users.size + ' Users\n' + selfbot.channels.size + ' Channels\n' + selfbot.guilds.size + ' Servers``');
	}
	if (message.content === prefix + 'ping') {
		console.log(message.author.username + ' executed: ping');
		var startTime = Date.now()
		var responseTime = startTime - message.timestamp;
		setTimeout(() => {
			message.edit('Pong! You\'re on server **' + message.channel.guild.name + '**.\nTook ``' + responseTime + '`` ms to respond.');
		}, 10);
	}
	if (message.content === prefix + 'time') {
		var d1 = new Date();
		message.channel.sendMessage('The time right now is ' + d1.toDateString());
	}
	if (message.content.startsWith(prefix + 'eval')) {
		console.log(message.author.username + ' executed: eval');
		var code = message.content.split(' ').splice(1).join(' ');
		try {
			// tries to run code
			if (message.author.id === selfbot.user.id) {
				message.channel.sendMessage('Code: ``' + code + '``\nOutput: ``' + eval(code) + '``'); // eslint-disable-line no-eval
			} else {
				message.channel.sendMessage('You do not have permission to use this command');
			}
		} catch (err) {
			message.channel.sendMessage('Error: ' + err);
		}
	}
	if (message.content === prefix + 'help') {
		message.edit(selfbot.user.username + '\'s Selfbot made by ASIANBOI#4112\nCommands include:' + '\n' + prefix + 'help, ' + prefix + 'eval, ' + prefix + 'time, ' + prefix + 'ping, ' +
			prefix + 'stats, ' + prefix + 'servers, ' + prefix + 'prune, ' + prefix + 'afk, ' + prefix + 'setgame, and other text shortcuts.');
	}
});