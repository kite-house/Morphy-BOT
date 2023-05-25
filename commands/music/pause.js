const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { SlashCommandBuilder} = require('discord.js');

module.exports = (client, interaction, config, error_handling) => {
    if (interaction.channel.id != config.music) return error_handling(client, interaction, 'CustomError [Music]: Incorrect text chat')

    client.DisTube.pause(interaction)
        .then (() => {
            interaction.reply(
                {embeds : [new EmbedBuilder()
                    .setTitle(`Успешно!`)
                    .setColor(Discord.Colors.Green)
                    .setDescription(`Вы поставили музыку на паузу!`)
                    .setFooter({
                        iconURL : client.user.avatarURL(client.user.avatar),
                        text: client.user.username + " • " + interaction.member.voice.channel.name
                    })
                    .setTimestamp()
                ],ephemeral: true    
            })
        })
        .catch(error => {
            error_handling(client, interaction, error)
        }
    )
}

// ====================== HELP ==============================

module.exports.help = {
    name : 'pause',
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Поставить музыку на паузу!")
}