/*
	ASIANBOI's Selfbot
	September 14, 2017
	Created by Michael Cao (ASIANBOI)

	------------------------------------------------------------------------------------------------------------------------------

	Documentation: Read through code - commented stuff needs to be changed. Install the packages util, fs, moment, request, and discord.js with the command "npm install util fs moment request discord.js".

	------------------------------------------------------------------------------------------------------------------------------

	Config File: Make a file called config.json and put this in it:

	{
		"token": "your_selftoken",
		"prefix": "prefix",
		"tchan": "channel-to-log-things-in",
		"webhookID": "webhook-id",
		"webhookTOKEN": "webhook-token",
		"rotating": true,
		"gameList": ["list", "of", "games", "to", "rotate", "through"]
	}

	------------------------------------------------------------------------------------------------------------------------------

	Config documentation:

	Token and prefix are self explanatory.
	tchan is the ID of the channel you want to log data in - this should be a private channel.
	webhookID and webhookTOKEN - the ID and token of a webhook.
		For example, with the webhook https://canary.discordapp.com/api/webhooks/277997662102618112/zzkoJLG3xPloltokendyfGvvbkKFaiV4MSjtZ4uQlbRg8OoE the ID is 277997662102618112 and the token is zzkoJLG3xPloltokendyfGvvbkKFaiV4MSjtZ4uQlbRg8OoE
	rotating is whether or not to rotate through the games on the gameList.
*/
const util = require('util');
const fs = require('fs');
const moment = require('moment');
var date = new Date().toLocaleDateString();
var time = new Date().toLocaleTimeString();

var request = require('request')

const Discord = require('discord.js');
const bot = new Discord.Client({
	fetchAllMembers: true,
	sync: true,
	disabledEvents: ["TYPING_START", "TYPING_STOP", "ROLE_CREATE", "ROLE_DELETE", "USER_UPDATE"]
});

const config = require('./config.json');
const prefix = config.prefix;

var rotating = config.rotating;
let i = 0;
var games = config.gameList;

const shortcuts = new Map([
	['lenny', '( ͡° ͜ʖ ͡°)'],
	['justright', '✋😩👌'],
	['pistols', '’ ̿’\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/’̿’̿ ̿'],
	['triggered', '**TRIGGERED**\nhttp://solomon.ddns.net:51337/i/un5mz.png'],
	['flip', '┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻'],
	['triggeredgif', '**TRIGGERED**\nhttps://giphy.com/gifs/vk7VesvyZEwuI'],
	['racist', '**THAT\'S WASIS!!!**\nhttps://giphy.com/gifs/waisis-5BuSYN14IXH4Q'],
	['goodshit', ':ok_hand::eyes::ok_hand::eyes::ok_hand::eyes::ok_hand::eyes::ok_hand::eyes: good shit go౦ԁ sHit:ok_hand: thats :heavy_check_mark: some good:ok_hand::ok_hand:shit right:ok_hand::ok_hand:there:ok_hand::ok_hand::ok_hand: right:heavy_check_mark:there :heavy_check_mark::heavy_check_mark:if i do ƽaү so my self :100: i say so :100: thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ:100: :ok_hand::ok_hand: :ok_hand:НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ:ok_hand: :ok_hand::ok_hand: :ok_hand: :100: :ok_hand: :eyes: :eyes: :eyes: :ok_hand::ok_hand:Good shit'],
	['blobs', '༼ つ ◕_◕ ༽つ I am one with the blob, the blob is with me ༼ つ ◕_◕ ༽つ'],
	['weird', 'ಠ_ಠ'],
	['jamming', 'ヾ(⌐■_■)ノ♪']
]);

var token = /((?:mfa.[\w-]+))/g;

bot.on('error', e => {
	webhook("Selfbot", "Error", "OH NO we encountered an error!\n" + e, "#ff0000");
	console.error(e.replace(token, 'REDACTED'));
	console.log(e.data)
});

bot.on('warn', e => {
	webhook("Selfbot", "Warning", "Warning\n" + e, "#ffe900");
	console.warn(e.replace(token, 'REDACTED'));
});

bot.on('disconnect', function() {
	console.log("Disconnected. Reconnecting...");
});

bot.on('ready', function() {
	webhook("Selfbot", "Success", `${bot.user.username}'s Selfbot is online and ready!`, "#04ff00");
	console.log(`${bot.user.username}'s bot Online and Ready! On ${bot.guilds.size} servers!`);
	bot.user.setStatus('dnd');
	if (rotating = true) {
		setGame();
		setInterval(() => {
			setGame();
		}, 300000)
	} else {
		fs.readFile('game.txt', function(err, data) {
			if (err) throw err;
			console.log(data);
			bot.user.setGame(data);
		});
	}
});

bot.on('message', msg => {
	if (msg.channel.type == 'text') {
		//Adjust this to your own needs
		if (msg.content.toLowerCase().includes('asianboi') || msg.content.toLowerCase().includes('asian') || msg.isMentioned(bot.user))
			webhook("Selfbot", "USER MENTION", `Just mentioned by ${msg.author.username} (${msg.author.id}) on ${msg.guild.name}/${msg.channel.name}:\n**${msg.cleanContent}**`, "#00fffa");

		const none2fa = /\w{24}\.\w{6}\.[\w\d-_]{27}/g;
		const full2fa = /((?:mfa.[\w-]+))/g;
		const invitelink = /(https:\/\/)?discord.gg\/...+/g;
	}

	if (msg.author !== bot.user) return;
	if (!msg.content.startsWith(prefix)) return;

	var commandName = msg.content.slice(prefix.length);
	if (shortcuts.has(commandName)) {
		setTimeout(() => {
			msg.edit(shortcuts.get(commandName))
		}, 10);
		return;
	}

	let text = msg.content;
	let args = text.split(" ");
	let command = text.substring(prefix.length, args[0].length).toLowerCase();

	try {
		if (command == 'embed') {
			let color = text.substring(prefix.length + 6, text.indexOf("|"));
			let embed = text.split("|");
			if (text.indexOf('|') > -1) {
				msg.delete();
				msg.channel.send('', {
					embed: {
						color: parseInt(color, 16),
						description: embed[1]
					}
				});
			} else {
				try {
					msg.edit('', {
						embed: {
							color: parseInt('FF0000', 16),
							description: text.substring(prefix.length + 6, text.length)
						}
					});
				} catch (err) {
					msg.delete();
					msg.channel.send('', {
						embed: {
							color: parseInt('FF0000', 16),
							description: text.substring(prefix.length + 6, text.length)
						}
					});
				}
			}
		}

		if (command == 'color') {
			let color = args[1];
			try {
				msg.edit('', {
					embed: {
						color: parseInt(color, 16),
						description: "**<-- #" + color + "**"
					}
				});
			} catch (err) {
				msg.channel.send(err.stack);
			}
		}

		if (command == 'spam') {
			msg.delete();
			var times = parseInt(args[1]);
			var content = text.substring(text.indexOf(times), text.length);
			content = content.substring(content.indexOf(" "), content.length);
			for (var i = 0; i < times; i++) {
				msg.channel.send(content);
			}
		}

		if (command == 'restart') {
			msg.edit(':wave: ' + bot.user.username + '\'s Selfbot is restarting...');
			setTimeout(function() {
				bot.destroy();
				process.exit(0);
			}, 2000);
		}

		if (command == 'prune') {
			let msgcount = parseInt(args[1]);
			msg.channel.fetchMessages({
				limit: msgcount
			}).then(msgs => {
				msgs.map(m => m.delete().catch(console.error));
			}).catch(console.error);
			msg.channel.send(bot.user.username + ', successfully pruned ' + args[1] + ' of your msgs!')
		}

		if (command == 'sp' || command == 'selfprune') {
			let delamount = parseInt(args[1]) ? parseInt(args[1]) : 1;
			msg.channel.fetchMessages({
					limit: 100
				})
				.then(messages => {
					msgar = messages.array();
					msgar = msgar.filter(msg => msg.author.id === bot.user.id);
					msgar.length = delamount + 1;
					msgar.map(msg => msg.delete().catch(console.error));
				});
		}

		if (command == 'servers') {
			console.log(msg.author.username + ' executed: servers');
			var limit = 100 - bot.guilds.size;
			msg.edit(`${bot.user.username}, you are in ${bot.guilds.size} servers!`);
		}

		if (command == 'serverlist') {
			var guilds = bot.guilds.array();
			var stats = new Discord.RichEmbed();
			var servers = [""];
			var n = 0;
			for (var i = 0; i < guilds.length; i++) {
				if ((servers[n] + guilds[i].name).length >= 1024) {
					n++;
				}
				if (servers[n] != undefined) {
					servers[n] += guilds[i].name + "\n";
				} else {
					servers[n] = guilds[i].name + "\n";
				}
			}
			for (var j = 0; j < servers.length; j++) {
				if (servers[j] != undefined) {
					if (servers.length == 1) {
						stats.addField("Server List", servers[j])
					} else {
						stats.addField("Server List Page " + (j + 1), servers[j])
					}
				}
				if (stats.fields.length == 2 || j == servers.length - 1) {
					stats.setColor(0xFF0000);
					msg.delete();
					msg.channel.send({
							"embed": stats
						})
						.then(msg => {
							setTimeout(() => {
								msg.delete();
							}, 30000);
						})
				}
			}
		}

		if (command == 'setgame') {
			var game = text.substring(prefix.length + 8, text.length);
			fs.writeFile('game.txt', game, 'utf8');
			console.log(msg.author.username + ' executed: setgame');
			bot.user.setGame(game);

			if (!rotating)
				msg.edit('Successfully set game to `' + game + '`. This will be your game until you change it.');
			else
				msg.edit('Successfully set game to `' + game + '`. NOTE: This will change the next time your game rotates.');
		}

		if (command == 'stats') {
			console.log(msg.author.username + ' executed: stats');
			var msgs = 0;
			var kick = 0;
			var server = 0;
			var admin = 0;
			var guilds = bot.guilds.array();

			for (var i = 0; i < guilds.length; i++) {
				if (guilds[i].members.get(bot.user.id).hasPermission('MANAGE_MESSAGES'))
					msgs++;
			}
			for (var i = 0; i < guilds.length; i++) {
				if (guilds[i].members.get(bot.user.id).hasPermission('KICK_MEMBERS'))
					kick++;
			}
			for (var i = 0; i < guilds.length; i++) {
				if (guilds[i].members.get(bot.user.id).hasPermission('MANAGE_GUILD'))
					server++;
			}
			for (var i = 0; i < guilds.length; i++) {
				if (guilds[i].members.get(bot.user.id).hasPermission('ADMINISTRATOR'))
					admin++;
			}
			var date = new Date(bot.uptime);
			var strDate = (date.getUTCDate() - 1) + ":" + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();

			var stats = new Discord.RichEmbed();
			stats.setColor(0x0000FF)
				.setAuthor(`${bot.user.username}`, `${bot.user.avatarURL}`)
				.setTitle(`Stats for ${bot.user.username}`)
				.setFooter(`${bot.user.username}'s Selfbot`, `${bot.user.avatarURL}`)
				.setTimestamp()
				.addField('Uptime', strDate, true)
				.addField('Account Created At', bot.user.createdAt.toLocaleString(), true)
				.addField('Friends', bot.user.friends.size, true)
				.addField('Users', bot.users.size, true)
				.addField('Channels', bot.channels.size, true)
				.addField('Emojis', bot.emojis.size, true)
				.addField('Servers', bot.guilds.size, true)
				.addField('Manage Messages Permissions', msgs + ' servers')
				.addField('Kick Members Permissions', kick + ' servers')
				.addField('Manage Server Permissions', server + ' servers')
				.addField('Administrator Permissions', admin + ' servers');
			msg.delete();
			msg.channel.send({
					"embed": stats
				})
				.catch(error => msg.channel.send(error.stack));
		}

		if (command == 'ping') {
			console.log(msg.author.username + ' executed: ping');
			startTime = Date.now();
			if (msg.channel.type === "text") {
				msg.edit("Pinging...").then((msg) => {
					endTime = Date.now();
					msg.edit('Pong! You\'re on the **' + msg.channel.guild.name + '** server.\nTook ``' + Math.round(endTime - startTime) + '`` ms to respond.');
				});
			}
			if (msg.channel.type === "dm") {
				msg.edit("Pinging...").then((msg) => {
					endTime = Date.now();
					msg.edit('Pong! You\'re in a DM with **' + msg.channel.recipient.username + '**.\nTook ``' + Math.round(endTime - startTime) + '`` ms to respond.');
				});
			}
		}

		if (command == 'shared') {
			var user = bot.users.get(msg.mentions.users.array()[0].id);
			user.fetchProfile()
				.then(profile => msg.edit("You share " + profile.mutualGuilds.size + " servers with " + user + "!"))
				.catch(err => msg.edit("Error. Check log for details.\n" + err));
		}

		if (command == 'tableflip') {
			msg.edit('(╯°□°）╯ ┬──┬')

			setTimeout(function() {
				msg.edit('(╯°□°）╯ ┬──┬')
			}, 1000);
			setTimeout(function() {
				msg.edit('(╯°□°）╯  ┫')
			}, 1500);
			setTimeout(function() {
				msg.edit('(╯°□°）╯    ┻━┻')
			}, 2000);
			setTimeout(function() {
				msg.edit('(╯°□°）╯       ┣')
			}, 2000);
			setTimeout(function() {
				msg.edit('(╯°□°）╯           ┬──┬')
			}, 2500);
			setTimeout(function() {
				msg.edit('( ͡° ͜ʖ ͡°)           ┬──┬')
			}, 3000)
		}

		if (command == 'members') {
			msg.edit(`**${msg.guild.name}** has ${msg.guild.members.size} members!`)
		}

		if (command == 'note') {
			var note = msg.content.split(" ").splice(1).join(" ");
			var embednote = new Discord.RichEmbed();
			embednote.setColor(0x0000FF)
				.setAuthor(`${bot.user.username}`, `${bot.user.avatarURL}`)
				.setFooter(`${bot.user.username}'s Selfbot`, `${bot.user.avatarURL}`)
				.setTimestamp()
				.addField('Note', note);
			bot.channels.get("290298049941602304").sendEmbed(embednote);

			msg.edit("Note successfully taken!");
		}

		if (command == 'eval') {
			var code = msg.content.split(" ").splice(1).join(" ");
			var embed = new Discord.RichEmbed();
			try {
				let evaled = eval(code);
				let type = typeof evaled;
				let insp = util.inspect(evaled, {
					depth: 0
				});

				if (evaled === null) evaled = 'null';

				embed.setColor(0x00FF00)
					.setAuthor(`${bot.user.username}`, `${bot.user.avatarURL}`)
					.setTitle("Selfbot Javascript Evaluation Complete!")
					.setFooter(`${bot.user.username}'s Selfbot`, `${bot.user.avatarURL}`)
					.setTimestamp()
					.addField('Code', "```js\n" + clean(code) + "```")
					.addField('Result', "```js\n" + clean(evaled.toString().replace(bot.token, 'REDACTED').replace(bot.user.email, 'REDACTED')) + "```");
				if (evaled instanceof Object) {
					embed.addField('Inspect', "```js\n" + insp.toString().replace(bot.token, 'REDACTED').replace(bot.user.email, 'REDACTED') + "```");
				} else {
					embed.addField('Type', "```js\n" + type + "```");
				}
				msg.delete();
				msg.channel.send({
					"embed": embed
				})
			} catch (err) {
				embed.setColor(0xFF0000)
					.setAuthor(`${bot.user.username}`, `${bot.user.avatarURL}`)
					.setTitle("Error in Selfbot Javascript Evaluation!")
					.setFooter(`${bot.user.username}'s Selfbot`, `${bot.user.avatarURL}`)
					.setTimestamp()
					.addField('Code', "```js\n" + clean(code) + "```")
					.addField('Error', "```LDIF\n" + clean(err.message) + "```");
				msg.delete();
				msg.channel.send({
						"embed": embed
					})
					.catch(error => console.log(error.stack));
			}
		}

		if (command == 'teval') {
			var code = msg.content.split(" ").splice(1).join(" ");
			var txt = "";
			msg.delete();
			try {
				let evaled = eval(code);
				let type = typeof evaled;
				let insp = util.inspect(evaled, {
					depth: 0
				});
				if (evaled === null) evaled = 'null';

				txt += 'Code ```js\n' + clean(code) + '```'
				txt += '\nResult ```js\n' + clean(evaled.toString().replace(bot.token, 'REDACTED').replace(bot.user.email, 'REDACTED')) + "```";
				if (evaled instanceof Object) {
					txt += '\nInspect ```js\n' + insp.toString().replace(bot.token, 'REDACTED').replace(bot.user.email, 'REDACTED') + '```';
				} else {
					txt += '\nType ```js\n' + type + '```';
				}
				msg.channel.send(txt)
			} catch (err) {
				txt += 'Code ```js\n' + clean(code) + '```\n'
				txt += 'Error ```LDIF\n' + clean(err.message) + '```';
				msg.channel.send(txt)
					.catch(error => console.log(error.stack));
			}
		}

		if (command == "exec") {
			var code = msg.content.split(" ").splice(1).join(" ");
			var exec = require("child_process").exec;
			exec(code, (err, stdout, stderr) => {
				if (err) msg.channel.send("PM2 had an error. ", err.code);
				else
					msg.edit("```\n" + stdout + "\n```")
			})
		}

		if (command == "reply") {
			var message = null,
				response = null;
			let id = msg.content.substring(prefix.length + 6, text.indexOf("|"));
			if (msg.content.indexOf('|') > -1) {
				response = msg.content.split("|")[1];
				msg.channel.fetchMessages({
						limit: 1,
						around: id
					})
					.then(messages => {
						message = messages.first();
						console.log(response + "|" + message.content);

						var embed = new Discord.RichEmbed();
						embed.setDescription(message.content || '\u200B')
							.setAuthor(message.member.nickname || message.author.username, message.author.displayAvatarURL)
							.setFooter('#' + message.channel.name)
							.setTimestamp(message.createdAt)
							.setColor(message.member.displayHexColor)

						if (message.attachments.size) {
							try {
								const url = message.attachments.first().url.toLowerCase();
								if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.webp')) {
									embed.setImage(message.attachments.first().url);
									console.log(message.attachments.first().url);
								} else {
									embed.setThumbnail(message.author.avatarURL);
								}
							} catch (err) {
								if (err.message !== 'Invalid URL') throw err;
							}
						}
						message.channel.send(response, {
							"embed": embed
						});
						embed = null;
					})
					.catch(console.error);
			}
			msg.delete();
		}

		if (command == 'server') {
			const embed = new Discord.RichEmbed()
				.setTitle(msg.guild.name)
				.setColor(0x1675DB)
				.setDescription('Server Information')
				.setFooter(msg.author.username, msg.author.avatarURL)
				.setThumbnail(msg.guild.iconURL)
				.setTimestamp()
				.addField('Name', msg.guild.name, true)
				.addField('Created', msg.guild.createdAt.toLocaleString(), true)
				.addField('ID', msg.guild.id, true)
				.addField('Owner', msg.guild.owner.user.username, true)
				.addField('Default Channel', msg.guild.defaultChannel, true)
				.addField('Region', msg.guild.region, true)
				.addField('Member Count', msg.guild.members.size, true)
				.addField('Channel Count', msg.guild.channels.size, true)
				.addField('Roles', msg.guild.roles.size, true)
			msg.delete();
			msg.channel.send({
				"embed": embed
			});
		}

		if (command == "emojisearch") {
			var guilds = [];
			if (msg.content.indexOf(":") > -1) {
				var content = msg.content.split(" ").splice(1).join(" "),
					i = content.indexOf(":") + 1,
					sub = content.substring(i, content.length)
				emoji = content.substring(i, sub.indexOf(":") + content.indexOf(":") + 1)
			} else {
				var emoji = msg.content.split(" ").splice(1).join(" ")
			}
			bot.guilds.forEach(guild => {
				guild.emojis.forEach(e => {
					if (e.name == emoji)
						guilds.push(guild.name);
				})
			})
			msg.edit("Found the emoji :" + emoji + ": in the following servers:\n" + guilds.join("\n"));
		}

		if (command == "gold") {
			msg.delete()
			msg.channel.send("**<:gold:288828853818753024> Discord Gold is required to view this message. Buy it today at https://discord.gold/**")
		}
	} catch (err) {
		msg.edit(`There was an error executing the command ${command}.\n` + err);
		webhook("Selfbot", "Error", "OH NO we encountered an error!\n" + err, "#ff0000");
	}
});

function setGame() {
	if (i == games.length)
		i = 0;
	console.log(games[i]);
	bot.user.setGame(games[i]);
	i++;
}

function clean(text) {
	if (typeof(text) === 'string')
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else
		return text;
}

function webhook(name, header, text, color) {
	try {
		var d = {
			"username": name,
			"text": "[]()",
			"attachments": [{
				"color": color,
				"fields": [{
					"title": header,
					"value": text
				}],
				"ts": new Date() / 1000
			}]
		}
		request({
			url: endpoint + "webhooks/" + config.webhookID + "/" + config.webhookTOKEN + "/slack",
			method: "POST",
			body: d,
			json: true
		});
	} catch (err) {
		console.log("Error: " + err.stack)
	}
}

bot.login(config.token);
