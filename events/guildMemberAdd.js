const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')


module.exports = (client,newUser, db, audit) => {
    client.channels.cache.get(audit).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: newUser.user.avatarURL(newUser.user.avatar) , name: `${newUser.user.username}#${newUser.user.discriminator}`})
            .setThumbnail(newUser.user.avatarURL(newUser.user.avatar))
            .setTitle(`Пользователь присоединился к серверу!`)
            .setDescription(`Новый участник <@${newUser.id}>`)
            .setColor(Discord.Colors.Green)
            .setTimestamp()
        ]})

    client.channels.cache.get("1105762254571446366").send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: newUser.user.avatarURL(newUser.user.avatar) , name: `${newUser.user.username}#${newUser.user.discriminator}`})
            .setThumbnail(newUser.user.avatarURL(newUser.user.avatar))
            .setTitle(`Новый пользователь!`)
            .setDescription(`${newUser} присоединился(-ась) к серверу!`)
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: `Всего пользователей: ${client.guilds.cache.get("1105726968260997120").memberCount}`
            })
            .setColor(Discord.Colors.DarkAqua)
            .setTimestamp()
        ]})
    
    let role = newUser.roles.cache.map(r => r).join(', ')
    role = role.replace(", @everyone", '')
    role = '['+ role +']'

    if (role == '[@everyone]'){
        role = 'None'
    }

    if (newUser.user.avatar == null){
        newUser.user.avatar = 'null'
    }

    if (newUser.nickname == null){
        newUser.nickname = newUser.user.username
    }

    let NewUser = [
        [newUser.user.id],
        [newUser.nickname],
        [newUser.user.username + '#' + newUser.user.discriminator],
        [newUser.user.avatar],
        [role]
    ]

    db.query(`INSERT INTO users(discord_id, username, nickname, avatar, role) VALUES (?)`, [NewUser], function(err, results) {
        if(err) client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${newUser.nickname}, STATUS: FAIL!`);
        client.channels.cache.get('1105738078443798588').send(`DATABASE MIGRATION: ${newUser.nickname}, STATUS: ACCEPT!`)
    })

}

module.exports.help = {
    name : 'guildMemberAdd',
    description: 'Обработка нового юзера'
}
