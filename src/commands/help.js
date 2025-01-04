import { SlashCommandBuilder } from '@discordjs/builders';
import { Embed, EmbedBuilder } from 'discord.js';
import { Logtail } from '@logtail/node';
import { LogLevel } from '@logtail/types';

// Logtail key
const logtail = new Logtail(process.env.LOGTAIL_KEY);

const COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Display the list of available commands');

const helpCommand = new EmbedBuilder()
	.setColor('#0099ff')
	.setTitle(`List of available commands`)
	.setDescription(
		`Here is the list of available commands \n For now, commands doesn't work with your real Steam pseudonym but with the name in your custom profile url. If you want to use your pseudonym you have to set a custom profil url in your steam profile settings or you have to use your SteamID64. You can find it [here](https://steamidfinder.com/lookup/)`
	)
	.setThumbnail(
		'https://images.frandroid.com/wp-content/uploads/2019/03/steam_logo.jpg'
	)
	.addFields(
		{
			name: '/time `SteamID64 or pseudonym`',
			value: 'Display the cumulated time of a Steam user',
		},
		{
			name: '/ownedgames `SteamID64 or pseudonym`',
			value: `Display the number of games owned by a Steam user`,
		},
		{
			name: '/steamprofile `SteamID64 or pseudonym`',
			value: `Display informations on a Steam user`,
		},
		{
			name: '/recentactivity `SteamID64 or pseudonym`',
			value: `Display the last activity of a Steam user`,
		},
		{
			name: '/setsteamid `SteamID64`',
			value: `Associate your SteamID64 to your Discord account. Once set you can use commands without any arguments`,
		}
	);

/**
 * Execute the /help command
 * @param {object} interaction Interaction object
 */
async function run(interaction) {
	await interaction.reply({
		embeds: [helpCommand],
	});
	logtail.info(`/help command executed by ${interaction.user.tag} `, LogLevel.Info);
}
export { run, COMMAND_DEFINITION };
