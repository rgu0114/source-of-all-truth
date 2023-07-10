import {
  InteractionType,
} from 'discord-interactions';
import { getRandomEmoji } from '../utils.js';
import { generate } from './generate.js'
import { help } from './help.js'
/**
 * A consolidation of application.commands using the built-in interactions endpoint
 */

export async function getInteractionsResponse (req) {
  const { type, data } = req.body;

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return {
          // Fetches a random emoji to send from a helper function
          result: 'hello world ' + getRandomEmoji(),
        };
    }

    // "help" command
    if (name === 'help') {
      try {
        const response = await help()
        return {
            result: response,
          };
        
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
        
        return {
            result: response.result,
          };
        
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
      }

    }
  }
}