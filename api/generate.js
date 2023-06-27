import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generate (req, res) {
  if (!configuration.apiKey) {
    return {
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    };
  }


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(req.body.input),
      temperature: 0.6,
    });
    return { result: completion.data.choices[0].text };
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return (error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return {
        error: {
          message: 'An error occurred during your request.',
        }
      };
    }
  }
}

function generatePrompt(input) {
  return `Please respond to the following prompt humorously: ${input}`;
}