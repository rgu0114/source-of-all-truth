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

  let timeoutDuration = 2000;
  let defaultResponse = { result: "OpenAI is thinking deeply about this one..." };

  try {
    const completionPromise = openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(req.body.input),
      temperature: 0.6,
      max_tokens: 500,
    })

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(defaultResponse);
      }, timeoutDuration);
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    
    if (completion.result) {
      console.log("returing default response")
      return defaultResponse;
    } else {
      return { result: completion.data.choices[0].text};
    }

  } catch (error) {
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
  console.log(input)
  return `Please respond to the following prompt humorously, and limit your response to 500 tokens: ${input}`;
}