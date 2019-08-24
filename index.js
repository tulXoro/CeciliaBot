const Discord = require('discord.js');//dependency
const NAME = 'Cecilia';//Name of bot
const VER = '1.1.1';//version # of bot
const bot = new Discord.Client();//bot is created as a discord client

//used to login to discord or something
const TOKEN = 'NjE0MjYxNjc2MzA0MjM2NTY0.XV9zxg.QoP3aJNbIm4MBygLoQ-AqXMfhrU';

//prefix to start commands
const PREFIX = '[]';

//for custom discord servers
const ADMIN_ROLE = '614614883815653386';//admin role that manages the bot

//other vars
var praise = 0;
var active_servers = 0;

//this program starts when bot is powered on
bot.on('ready', () => {   
    console.log('Powering on!');//notifies console that program is starting (REDUNDANT)
    
    bot.user.setActivity('around with toys', { type: "PLAYING" }).catch(console.error);//sets the bpt's activity (ex: "Playing Minecraft")
    
    //prints each server that the bot is a member of
    bot.guilds.forEach(guild => {
        console.log(guild.name);
        active_servers++;
    
        //prints each channel of every server
        guild.channels.forEach(channel => {
            console.log(`   -${channel.name} ${channel.type} ${channel.id}`);
            if(channel.id == 598068252949610497) channel.send("I'm online again!");//temp thing to notify channel that the bot is on
        })

        //prints all the roles from each server
        guild.roles.forEach(role => {
            console.log(`       -${role.name}`);
        })
    });

    //prints in the console when everything has ran correctly
    console.log('Powered up and ready to go!');
})

//when bot is disconnected
bot.on('disconnected', () => {
    console.log('[META][WARN] Disconnected from Discord API Service. Attempting to reconnected...');
});

//warning from Discord.js
bot.on('warn', err => {
    console.log('[META][WARN] ' + msg);
});

//error from Discord.js
bot.on('error', err => {
    console.log('[META][ERROR] ' + err.msg);
    process.exit(1);
});

//called whenever the a new member joins a server
bot.on("guildMemberAdd", member => {
    //sets the channel to post a message in (only works if the channel name is "news"
    const channel = member.guild.channels.find(channel => channel.name == "news")
    if(!channel) return; //if the channel doesn't exist, then stop the program

    //sends a message to the channel to welcome the user
    channel.send(`Welcome to Dystopian Utopia ${member}! Please check #rules!`);
})


//called whenever someone joins/leaves the voice channel
//i didn't know how to implement it so i borrowed it from stack overflow
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    const voice_role = oldMember.guild.roles.find(role => role.name == "In Voice Channel");
    if(!voice_role) return;

    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
  
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

    if(msg.content == "good bot"){
        praise++;
        return msg.channel.send('(.❛ ᴗ ❛.)');
    }

    //if the message does not start with the prefix, then this method stops
    if(!msg.content.startsWith(PREFIX)) return;

    //if the bot detects a message which is in a dm or group, this method stops
    if(msg.channel.type == 'dm' || msg.channel.type == 'group')
        return msg.channel.sendMessage('Oops! Sorry I can\'t respond to direct messages!');

    //creates an array called "args" that seperates each word by a space
    //ex: "{PREFIX}Hello there!" will make an array with 2 elements
    //where args[0] equals "Hello" and args[1] equals "there!" etc..
    let args = msg.content.substring(PREFIX.length).split(" ");

    //a switch statement which takes the first word and compares it. This
    //is the primary way to make bot commands
    switch(args[0]){
        //essentials
        case 'help':
            return msg.reply('Sorry, I would if I could! But my commands are a work in progress!');

        //chat
        case 'apologize':
            return msg.reply('I\'m really sorry! Please accept my apology!');
        
        //admin
        case 'delete':
            if(!msg.member.roles.has(ADMIN_ROLE))
                return msg.channel.send('Sorry, you don\'t have the right permissions to do that!');
            if(!args[1]) 
                return msg.channel.send('Sorry, please tell me the amount of messages you want me to delete!');
            if(isNaN(args[1]))
                return msg.channel.send('Please take this seriously! You didn\'t give me a number!');
            return msg.channel.bulkDelete(args[1]);

        //bot
        case 'bot':
                if(args[1]=='stats'){
                    const embed = new Discord.RichEmbed()
                                    .setTitle('My statistics!')
                                    .addField('Creator', 'tulxoro#3977', true)
                                    .addField('Verson', VER, true)
                                    .addField("Current Server", msg.guild.name, true)
                                    .addField('Active Servers', active_servers, true)
                                    .addField('Praise', praise)
                                    .setColor(0x00FBFF)
                                    .setThumbnail(bot.user.avatarURL)
                                    .setFooter('Sorry if I\'m buggy! I am still in development! Original image: https://bit.ly/30vWVvN');
                    return msg.channel.send(embed);
                }
        
    }
})

//the bot logs on and starts using the profile token
bot.login(TOKEN);
