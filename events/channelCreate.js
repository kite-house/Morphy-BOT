const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')


module.exports = async (client, newChannel, config) => {
    const AuditLogFetch = await newChannel.guild.fetchAuditLogs({limit: 1})
    const Entry = AuditLogFetch.entries.first()
    
    if (newChannel.type == 0){
        typeChannel = 'текстовой'
    }

    if (newChannel.type == 2){
        typeChannel = 'голосовой'
    }

    console.log(`SERVER-INFO: CREATE_NEW_CHANNEL | TYPE: ${newChannel.type} | NAME: ${newChannel.name} | STATUS:`, 'ACCEPT!'.green)

    client.channels.cache.get(config.ds_server).send(
        {embeds : [new EmbedBuilder()
            .setAuthor({iconURL: newChannel.guild.iconURL({Dynamic : true}) , name: newChannel.guild.name})
            .setThumbnail(newChannel.guild.iconURL({Dynamic : true}))
            .setTitle(`Создан ${typeChannel} канал!`)
            .setColor(Discord.Colors.Green)
            .setFields([
                {
                name: 'Название:',
                value : `${newChannel.name}`,
                inline: true
                },
                {
                    name: 'Информация:',
                    value : `Создал: <@${Entry.executor.id}>`,
                }

            ])
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: `ID Channel: ${newChannel.id}`
            })
            .setTimestamp()
        ]})
}

// ================== HELP ============================

module.exports.help = {
    name : 'channelCreate',
    description : 'Создание канала'
}