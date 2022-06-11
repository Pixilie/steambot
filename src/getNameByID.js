import config from '../config.json' assert { type: 'json' };
import fetch from 'node-fetch';

const steamAPI_getNameByID = new URL(
	`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.apiKey}&format=json`
);

async function getNameByID(name) {
	steamAPI_getNameByID.searchParams.set('vanityurl', name);

	let response = await fetch(steamAPI_getNameByID)
		.then((res) => res.json())
		.then((json) => json.response);

	return response.steamid ?? null;
} 

export { getNameByID };
