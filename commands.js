import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const HELP_COMMAND = {
  name: 'help',
  description: 'Ask for help',
  type: 1,
}

// Ask Chat GPT command
const ASK_COMMAND = {
  name: 'ask',
  description: 'Ask Chat GPT',
  type: 1,
}



const ALL_COMMANDS = [TEST_COMMAND, HELP_COMMAND, ASK_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);