const Discord = require('discord.js');
const NAME = 'Cecilia';
const VER = '1.0.0';
const bot = new Discord.Client();

const TOKEN = '/----REMOVED TO PROVENT THEFT-----/';

const PREFIX = '[]';

bot.on('ready', () => {
    console.log('Powering on!');
    bot.user.setActivity('YouTube videos', { type: "WATCHING" }).catch(console.error);
})

bot.on("guildMemberAdd", member => {

    const channel = member.guild.channels.find(channel => channel.name === "news")
    if(!channel) return;

    channel.send(`Welcome to Dystopian Utopia ${member}! Please check #rules!`);
})

bot.on('message', msg => {

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'help':
            return msg.reply('I\'d rather not help you. Figure it out youself!');
        case 'introduce':
            if(args[1]==='yourself')
                return msg.channel.send('Hi everyone! I\'m ' +  NAME + ' bot (name is still in development). Nice to meet you!');
        case 'delete':
            if(!args[1]) 
                return msg.channel.send('Sorry, please tell me the amount of messages you want me to delete!');
            msg.channel.bulkDelete(args[1]);
            break;
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
                msg.channel.sendEmbed(embed);
            }break;

    }
})

bot.login(TOKEN);