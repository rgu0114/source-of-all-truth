import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji } from './utils.js';
import { generate } from './api/generate.js'
import { help } from './api/help.js'
import { Client, IntentsBitField } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {

  const { type, id, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }

    // "help" command
    if (name === 'help') {
      try {
        const response = await help()
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: response,
          },
        });
        
      } catch (error) {
        console.log(error)
      }
    };

    // "ask" command
    if (name === 'ask') {
      console.log(data)
      const request = {
        method: "POST",
        body: { input: "testing" },
      };
      
      try {
        const response = await generate(request)
        
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: response.result,
          },
        });
        
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
      }

    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});


// Initializing a new bot instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
})

client.on('ready', () => {
  console.log("The bot is now online.")
})

const configuration = new Configuration ({
  apiKey: process.env.API_KEY,
})

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  // Ignores msgs sent by bots
  if (message.author.bot) return;
  // Ignores msgs not sent in designated channel
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  // Ignores msgs that don't start with the slash command
  if (!message.content.startsWith('/chat ')) return;

  let conversationLog = [{ role: 'system', content: "You are a funny sarcastic chatbot. You regularly quote star wars memes, history memes, and are occasionally extremely rude. "}];

  await message.channel.sendTyping();

  let prevMessages = await message.channel.messages.fetch({ limit: 15});
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (!message.content.startsWith('/chat ')) return;
    if (msg.author.id !== client.user.id && message.author.bot) return;
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({
      role: 'user', 
      content: msg.content,
    })
  })

  console.log("conversation log", conversationLog)

  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversationLog,
  })

  message.reply(result.data.choices[0].message)
})

client.login(process.env.TOKEN);