const Discord = require('discord.js');//dependency
const YTDL = require('ytdl-core');

//const fs = require('fs');
const NAME = 'Cecilia';//Name of bot
const VER = '1.4.0';//version # of bot
const bot = new Discord.Client();//bot is created as a discord client

//used to login to discord or something
const TOKEN = 'NjE0MjYxNjc2MzA0MjM2NTY0.XWDKiw.WmPHCiiD6hhILrlvcS18Vev6KnQ';

//prefix to start commands
const PREFIX = '[]';

//for my own discord server
const ADMIN_ROLE = '614614883815653386';//admin role that manages the bot

var servers = {};

//other vars
var praise = 0;
var active_servers = 0;

//this program starts when bot is powered on
bot.on('ready', () => {   
    console.log('Powering on!');//notifies console that program is starting (REDUNDANT)
    
    //sets the bot's activity (ex: "Playing Minecraft")
    bot.user.setActivity('some music', { type: "PLAYING" }).catch(console.error);

    //set the bot's status
    bot.user.setStatus('online').catch(console.error);
    
    //prints each server that the bot is a member of
    bot.guilds.forEach(guild => {
        console.log(guild.name);
        active_servers++;
    
        //prints each channel of every server
        guild.channels.forEach(channel => {
            console.log(`   -${channel.name} ${channel.type} ${channel.id}`);
            //if(channel.id == 598068252949610497) 
                //channel.send("I'm online again!");//temp thing to notify channel that the bot is on
        })

        //prints all the roles from each server
        guild.roles.forEach(role => {
            console.log(`       -${role.name}`);
        })
    });

    //prints in the console when everything has ran correctly
    console.log('Powered up and ready to go!');
})

//called whenever a new member joins a server
bot.on("guildMemberAdd", member => {
    //sets the channel to post a message in (only works if the channel name is "news")
    const channel = member.guild.channels.find(channel => channel.name == "news")
    const ruleChannel = member.guild.channels.find(channel => channel.name == "rules")
    if(!channel || !ruleChannel) return; //if the channel doesn't exist, then stop the program

    //sends a message to the channel to welcome the user
    channel.send(`Welcome to Dystopian Utopia ${member}! Please check ${ruleChannel}! I hope you enjoy your stay!`);

    //auto assigns a role to the new user
    const newRole = member.guild.roles.find(role => role.name == "Member");
    if(!newRole) return;
    member.addRole(newRole);
})

bot.on("guildMemberRemove", member => {
    const channel = member.guild.channels.find(channel => channel.name == "news")
    if(!channel) return;

    channel.send(`${member.user.username}#${member.user.discriminator} has left the server!`);
})

//called whenever someone joins/leaves the voice channel
//i didn't know how to implement it so i borrowed it from stack overflow
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    //if a role isn't found, then return
    const voice_role = oldMember.guild.roles.find(role => role.name == "In Voice Channel");
    if(!voice_role) return;

    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
    
    //checks when a member leaves or enters a channel
    if(newUserChannel && !oldUserChannel) oldMember.addRole(voice_role);
    else if(!oldUserChannel && newUserChannel) oldMember.addRole(voice_role);
    else if(!newUserChannel) newMember.removeRole(voice_role);
})

/*
 * called whenever a message is sent to a channel that the bot has access to
 * Used to make commands
 */
bot.on('message', msg => {
    //if the "author" or user who sent the message is the bot, then this method stops
    if(msg.author == bot.user) return;
    
    //just a simple command to praise the bot
    if(msg.content == "good bot"){
        praise++;
        console.log(`${msg.author.username}#${msg.author.discriminator} praised me!`);
        return msg.channel.send('(.❛ ᴗ ❛.)');
    }
    
    //if the bot detects a message which is in a dm or group, this method stops
    if(!msg.guild){
        let d = new Date();
        let temp = `${msg.author.username}#${msg.author.discriminator} tried DMing: "${msg.content}" at` + 
                    " " + d.getMonth() + " " + d.getDay() + " " + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        console.log(temp);
        //log(temp);
        return msg.author.send('Oops! Sorry I can\'t respond to direct messages!');
    }

    //if the message does not start with the prefix, then this method stops
    if(!msg.content.startsWith(PREFIX)) return;

    //creates an array called "args" that seperates each word by a space
    //ex: "{PREFIX}Hello there!" will make an array with 2 elements
    //where args[0] equals "Hello" and args[1] equals "there!" etc..
    let args = msg.content.substring(PREFIX.length).split(" ");

    //common variables which help reduce lines of code
    let member = msg.member;
    let channel = msg.channel;

    //a switch statement which takes the first word and compares it. This
    //is the primary way to make bot commands
    switch(args[0]){
        //essentials
        case 'help':
                const embed = new Discord.RichEmbed()
                                .setTitle('Commands')
                                .addField('[]introduce', 'Let me give you an introduction!')
                                .addField('[]y/n', "Ask me a yes or no question!")
                                .addBlankField(false)
                                .addField("[]play", "Let's play some songs!")
                                .addField("[]queue", "Take a look at the songs currently playing!")
                                .addField("[]skip", "Skip the current song!")
                                .addField('[]leave', "I'll leave the voice channel!")
                                .addBlankField(false)
                                .addField('[]dm', "Send a direct message to someone!")
                                .addField('[]purge', "Delete messages!")
                                .addBlankField(false)
                                .addField('[]bot stats', "Everything you need to know about me!")
                                .setColor(0x00FBFF)
                                .setThumbnail(bot.user.avatarURL)
                                .setFooter('Sorry if I\'m buggy! I am still in development! Original image: https://bit.ly/30vWVvN');
            return channel.send(embed);

        //chat
        case 'introduce':
			return channel.send("I'm a bot programmed by tulXoro (further known as Tim)! I'm currently running on his Raspberry Pi!");
        case 'apologize':
            return msg.reply('I\'m really sorry! Please accept my apology!');
        case 'y/n':
            if(args.length<4) return channel.send("Are you sure that's a question?");
            let r = Math.floor(Math.random() * 2);
            if(r==1) return channel.send("Of course!");
            else return channel.send("No way!");
        case 'dm':
            let mention = msg.mentions.users.first();
            if(!mention) return channel.send("Please mention the person you want me to DM");
            let mentionMsg = msg.content.slice(5);
            mention.send(`${msg.author.username}#${msg.author.discriminator} said "${mentionMsg}"`);
            return msg.delete();

        //music
        case 'leave':
            if(msg.guild.voiceConnection) {
                msg.guild.voiceConnection.disconnect();
                return channel.send('I left the voice channel!');
            }else return channel.send('I\'m not in a voice channel!');

        case 'play':
            if(!member.voiceChannel) return channel.send("Please be in a voice channel!");

            if(!args[1]) return channel.send("Please provide a YouTube link!");

            if(!args[1].includes("https://youtu.be") && !args[1].includes("https://youtube"))
                return channel.send("Sorry! Please insert a valid YouTube link!");
            
            if(!servers[msg.guild.id]){//when server does not exist in list
                servers[msg.guild.id] = { 
                    queue: [],
                    repeat: false,
                    loop: false
                };//add server to the list with a queue
            }

            if(bot.voiceConnections.has(member.voiceConnection)) return;

            if(!servers[msg.guild.id].queue[0]){
                member.voiceChannel.join().then(connection => {//bot joins voice channel
                    servers[msg.guild.id].queue.push(args[1]);
                    play(connection, msg); //calls play function
                }).catch(console.log);
                return channel.send("I'm playing music! I'm a little more confident about myself now but I still might not work correctly!");;
            }

            servers[msg.guild.id].queue.push(args[1]);
            return channel.send(`Added to the queue!`);
            
        case 'queue':
            if(!servers[msg.guild.id]) return channel.send("No queue to show!");
            var server = servers[msg.guild.id];
            if(!server.queue || !server.queue[0]) return channel.send("No queue to show!");
            var embedQ = new Discord.RichEmbed().setTitle("Queue").setColor(0x00FBFF);
            for(var i=0; i<server.queue.length; i++){
                if(i==0) embedQ.addField("Now playing", server.queue[0]);
                /*YTDL.getInfo(args[0], (err, info) =>{});*/
                else embedQ.addField(i, server.queue[i]);
                /*YTDL.getInfo(args[i], (err, info) => {});*/
            }return channel.send(embedQ);
        case 'skip': 
            var server = servers[msg.guild.id];
            if(server.dispatcher){ 
                server.dispatcher.end();
                return channel.send("Skipped the song!");
            }return channel.send("Could not skip the song!");
        case 'stop':
            var server = servers[msg.guild.id];
            if(msg.guild.voiceConnection) msg.guild.voiceConnection.disconnect();
            return;/*
        case 'repeat':
            if(!servers[msg.guild.id]) return channel.send("Nothing to repeat!");
            var server = servers[msg.guild.id];
            if(!server.queue || !server.queue[0]) return channel.send("There isn't anything to repeat!");
            
            server.repeat = server.repeat == 0 ? 1 : 0;

            if(server.repeat==1) return channel.send("Ok! I'll loop the current song!");
            return channel.search("Ok! I won't loop the song!");
            */
            
        case 'loop'://loops queue
            if(!servers[msg.guild.id]) return channel.send("Nothing to loop!");
            var server = servers[msg.guild.id];
            if(!server.queue || !server.queue[0]) return channel.send("There isn't anything to loop!");
            
            server.loop = !server.loop;

            if(server.loop==true)return channel.send("Ok! I'll loop the song!");
            return channel.send("Ok! I won't loop the queue!")

        //admin
        case 'purge':
            if(!msg.guild.roles.has(ADMIN_ROLE))
                return channel.end("Sorry, this command is disabled in this server at the moment!");
            if(!member.roles.has(ADMIN_ROLE))
                return channel.send('Sorry, you don\'t have the right permissions to do that!');
            if(!args[1]) 
                return channel.send('Sorry, please tell me the amount of messages you want me to delete!');
            if(isNaN(args[1]))
                return channel.send('Please take this seriously! You didn\'t give me a number!');
            return channel.bulkDelete(args[1]);
            
        //bot
        case 'bot':
                if(args[1]=='stats'){
                    const embed = new Discord.RichEmbed()
                                    .setTitle('My statistics!')
                                    .addField('Creator', 'tulxoro#3977', true)
                                    .addField('Version', VER, true)
                                    .addField("Current Server", msg.guild.name, true)
                                    .addField('Active Servers', active_servers, true)
                                    .addField('Praise', praise, true)
                                    .addField('Uptime', getUpTime(), true)
                                    .setColor(0x00FBFF)
                                    .setThumbnail(bot.user.avatarURL)
                                    .setFooter('Sorry if I\'m buggy! I am still in development! Original image: https://bit.ly/30vWVvN');
                    return channel.send(embed);
                }
    }
})

//claculates the total time that the bot has been up
function getUpTime() {
    let tot_uptime = bot.uptime/1000.0;//gets seconds
    if(tot_uptime<60.0) return tot_uptime.toFixed(1) + " seconds";
    tot_uptime = tot_uptime/60;//minutes
    if(tot_uptime<60.0) return tot_uptime.toFixed(1) + " minutes";
    tot_uptime = tot_uptime/60;//hours
    if(tot_uptime<24) return tot_uptime.toFixed(1) + " hours";
    tot_uptime = tot_uptime/24; //days
    return tot_uptime.toFixed(1) + " days";
}

function play(connection, msg){
    var server = servers[msg.guild.id];
    server.dispatcher = connection.playStream(YTDL(servers[msg.guild.id].queue[0], {filter: "audioonly", quality: "highestaudio"}));//for some reason, when playing multiple, it stops
    server.dispatcher.on("end", () => {
        if(server.loop==false) server.queue.shift();/*
        if(server.loop==true){
            server.queue.push(server.queue[0]);
            server.queue.shift();
        }
        */
        if(servers[msg.guild.id].queue[0]) play(connection, msg);
        else connection.disconnect();
    })
}

//function log(str){ fs.appendFile('log.txt', str, err => console.log(err)); }

//the bot logs on and starts using the profile token
bot.login(TOKEN);
