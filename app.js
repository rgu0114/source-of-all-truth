import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji } from './utils.js';
import { generate } from './api/generate.js'
import { help } from './api/help.js'

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
