import config from '../../config.json' assert { type: 'json' };
import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getIDByNameOrID } from '../helpers.js';
import { isPrivate } from '../helpers.js';
import { Log } from '../helpers.js';
import { steamProfileName } from '../helpers.js';
import { isLink } from '../helpers.js';

const steamAPI_gamesOwned = new URL(
	`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?format=json&key=${config.apiKey}`
);

let COMMAND_DEFINITION = new SlashCommandBuilder()
	.setName('ownedgames')
	.setDescription('Number of games owned by a Steam user')
	.addStringOption((option) =>
		option
			.setName('pseudo-or-id64')
			.setDescription("User's Steam pseudo or user's SteamID64")
			.setRequired(false)
	);

/**
 * Get number of games you own from steam API with the pseudonym or the SteamID of the user
 * @param {string} value Pseudonym or SteamID of the user
 */
async function gamesOwned(value, interaction) {
	const { steamid, error } = await isLink(value, interaction);

	if (error) {
		return { error: error };
	} else {
		value = steamid;
	}

	steamAPI_gamesOwned.searchParams.set(
		'steamid',
		await getIDByNameOrID(value)
	);

	let apiResponse = await fetch(steamAPI_gamesOwned);
	let pseudo = await steamProfileName(value);

	if (apiResponse.status !== 200) {
		return { error: `An error has occurred, ${value} is invalid` };
	}

	let content = await apiResponse.json();

	if ((await isPrivate(content.response)) === true) {
		return { error: `This profile is private` };
	}

	let gamesOwned = content.response.game_count;

	return { games: gamesOwned, pseudo: pseudo };
}

async function run(interaction) {
	let value = interaction.options.getString('pseudo-or-id64');

	const { games, error, pseudo } = await gamesOwned(value, interaction);

	if (error) {
		Log(
			`${interaction.user.tag} tried to execute /ownedgames with the following arguments "${value}" but an error has occurred: ${error}`,
			'info'
		);
		return interaction.reply({ content: error, ephemeral: true });
	}

	await interaction.reply(
		`<@${interaction.user.id}>, ${pseudo} own ${games} games on Steam`
	);
	Log(
		`/ownedgames command executed by ${interaction.user.tag} with the following arguments "${value}"`,
		'info'
	);
}

export { run, COMMAND_DEFINITION };
