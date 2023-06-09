const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const event_check_datetime = require('../module/event_check_datetime')

module.exports = (client, interaction, name, time, limited, date, text, check_permision, db, config, error_handling) => {
    if(!check_permision(client, interaction, 'Owner, Developer, Admin')) return
    if(!event_check_datetime(date, time)) return error_handling(client, interaction, "CustomError [Event]: Validation error")

    if (limited == null){
        limited = 999
    }

    if (date == null){
        date = 'Сегодня'
    }

    if (text == null){
        text = 'Быть всем!'
    }
    
    interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle("Успешно!")
            .setDescription('Вы начали регистрацию учатников на мероприятие!')
            .setColor(Discord.Colors.Green)
            .setFields({
                name : "Информация: ",
                value : `Дата: ${date}, Время: ${time}, Название: ${name}, Огран: ${limited} `
            })
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + ' BOT'
            })
            .setTimestamp()
    ], ephemeral: true})


    const go_event = new ButtonBuilder()
        .setCustomId(`go_event`)
        .setLabel('Участвовать!')
        .setDisabled(false)
        .setStyle(ButtonStyle.Success);

    const leave_event = new ButtonBuilder()
        .setCustomId(`leave_event`)
        .setLabel('Отменить участие!')
        .setDisabled(false)
        .setStyle(ButtonStyle.Danger);

    const queue_event = new ButtonBuilder()
        .setCustomId(`queue_event`)
        .setLabel('Список')
        .setDisabled(false)
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(go_event, leave_event, queue_event)

    
    for (let i = 0; i <= 2; i++) {
        client.channels.cache.get(config.reg_event).send("@everyone").then(msg => {
            setTimeout(() => msg.delete(), 3000)
        })
    }

    client.channels.cache.get(config.reg_event).send({
        embeds: [new EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setTitle("Сбор на мероприятие!")
            .setDescription(`${text}`)
            .setColor(Discord.Colors.White)
            .setFields({
                name : "Информация: ",
                value : `Дата: ${date}, Время: ${time}, Название: ${name}, Огран: ${limited} `
            })
            .setFooter({
                iconURL : client.user.avatarURL(client.user.avatar),
                text: client.user.username + ' BOT'
            })
            .setTimestamp()
    ], components: [row]}).then(message => {

        if (date == 'Сегодня'){
            date = new Date().toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'}).split(',')[0]
        }

        Create_Events_DB = [
            [message.id],
            [interaction.user.id],
            [`active`],
            [name],
            [date],
            [time],
            [0],
            [limited],
            [''],
            ['']
        ]

        db.query("INSERT INTO events(`id_event`, `created`, `status`, `names`, `date`, `time`, `quantity`, `limited`, `participants`, `reserve`) VALUES (?)", [Create_Events_DB], function(error, results) {
            if(error) {client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT ${message.id}, STATUS: ${error}`);}
            client.channels.cache.get(config.database).send(`DATABASE MIGRATION: EVENT ${message.id}, STATUS: ACCEPT!`)
        })
    })
    console.log(`INTERACTION-INFO: USER: ${interaction.user.id} | USED: ${interaction.commandName} | STATUS:`, 'ACCEPT!'.green)
}

// ====================== HELP ==============================


module.exports.help = {
    name : 'event',
    data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Начать регистрация на мероприятие!")
    .addStringOption(option => 
        option
        .setName('name')
        .setDescription("Название мероприятие")
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName('time')
        .setDescription("Время начало мероприятие (Часы:Минуты)")
        .setRequired(true)
        .setMinLength(4)
        .setMaxLength(5)
    )

    .addIntegerOption(option => 
        option
        .setName('limited')
        .setDescription("Ограничение количество участников")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(99)
        )

    .addStringOption(option => 
        option
        .setName("date")
        .setDescription("Дата проведения мероприятие(оставьте пустым если мероприятие пройдёт сегодня), День.Месяц.Год")
        .setRequired(false)
        .setMinLength(9)
        .setMaxLength(10)
    )
    .addStringOption(option => 
        option
        .setName('text')
        .setDescription("Допольнительный текст")
        .setRequired(false)
    )
}