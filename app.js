import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import { Client, IntentsBitField } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { getInteractionsResponse } from './api/interactions.js';
import { chat } from './api/chat.js'

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {

  const { type } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }
  
  try {
    const response = await getInteractionsResponse(req)
        
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: response.result,
      },
    });
        
  } catch(error) {
      console.error(error);
  }
}
);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

// END OF EXPRESS APP (discord.js from here on out)

console.log('initialized express app');

// Initializing a new bot instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

console.log('initialized client')

client.on('ready', () => {
  console.log("The bot is now online.")
})

const configuration = new Configuration ({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  // Ignores msgs sent by bots
  if (message.author.bot) return;
  // Ignores msgs not sent in designated channel
  // if (message.channel.id !== process.env.CHANNEL_ID) return;
  // Ignores msgs that don't start with the slash command
  if (!message.content.startsWith('/chat ')) return;

  chat(message, client, openai);
})

client.login(process.env.DISCORD_TOKEN);