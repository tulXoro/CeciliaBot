const Discord = require('discord.js');//dependency
const NAME = 'Cecilia';//Name of bot
const VER = '1.0.0';//version # of bot
const bot = new Discord.Client();//bot is created as a discord client

//used to login to discord or something
const TOKEN = '';

//prefix to start commands
const PREFIX = '[]';

//this program starts when bot is powered on
bot.on('ready', () => {
    
    //notifies console that program is starting (REDUNDANT)
    console.log('Powering on!');

    //sets the bpt's activity (ex: "Playing Minecraft")
    bot.user.setActivity('YouTube videos', { type: "WATCHING" }).catch(console.error);
    
    //prints each server that the bot is a member of
    bot.guilds.forEach(guild => {
        console.log(guild.name);
        
        //prints each channel of every server
        guild.channels.forEach(channel => {
            console.log(`   -${channel.name} ${channel.type} ${channel.id}`);

        })
    });

    //prints in the console when everything has ran correctly
    console.log('Powered up and ready to go!');

})

//called whenever the a new member joins a server
bot.on("guildMemberAdd", member => {

    //sets the channel to post a message in (only works if the channel name is "news"
    const channel = member.guild.channels.find(channel => channel.name === "news")

    //if the channel doesn't exist, then stop the program
    if(!channel) return;

    //sends a message to the channel to welcome the user
    channel.send(`Welcome to Dystopian Utopia ${member}! Please check #rules!`);

})

/*
 * called whenever a message is sent to a channel that the bot has access to
 * Used to make commands
 */
bot.on('message', msg => {

    //if the "author" or user who sent the message is the bot, then stop this program
    if(msg.author == bot.user) return;

    //if the message does not start with the prefix, then stop this program
    if(!msg.content.startsWith(PREFIX)) return;
    
    //creates an array called "args" that seperates each word by a space
    //ex: "{PREFIX}Hello there!" will make an array with 2 elements
    //where args[0] equals "Hello" and args[1] equals "there!" etc..
    let args = msg.content.substring(PREFIX.length).split(" ");

    //a switch statement which takes the first word and compares it. This
    //is the primary way to make bot commands
    switch(args[0]){

        case 'help':
            if(msg.author.username==='tulxoro') return msg.reply('Sorry, I would if I could! But I\'m not sure how I can help!');
            return msg.reply('I\'d rather not help you. Figure it out youself!');

        case 'introduce':
            if(args[1]==='yourself')
                return msg.channel.send('Hi everyone! I\'m ' +  NAME + ' bot (name is still in development). Nice to meet you!');

        case 'delete':
            if(!args[1]) 
                return msg.channel.send('Sorry, please tell me the amount of messages you want me to delete!');
            return msg.channel.bulkDelete(args[1]);
            
        case 'bot':
            if(args[1]==='stats'){
                const embed = new Discord.RichEmbed()
                                .setTitle('My statistics!')
                                .addField('Creator', 'tulxoro#3977', true)
                                .addField('Verson', VER, true)
                                .addField("Current Server", msg.guild.name)
                                .setColor(0x00FBFF)
                                .setThumbnail(bot.user.avatarURL)
                                .setFooter('Sorry if I\'m buggy! I am still in development!');
                return msg.channel.sendEmbed(embed);
            }

        case 'apologize':
            if(msg.author.username==='tulxoro') return msg.reply('I\'m really sorry! Please accept my apology!');
            return msg.reply('Why should I apologize to you?');

    }
})

//the bot logs on and starts using the profile token
bot.login(TOKEN);
