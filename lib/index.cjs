const { Configuration, OpenAIApi } = require("openai");

async function analyze(openApiKey, maxTokens, tristateAnalyzerConfig, data) {
  const configuration = new Configuration({
    apiKey: openApiKey,
  });

  const openai = new OpenAIApi(configuration);

  const prompt = `Return \"yes\" if ${tristateAnalyzerConfig.yesCriteria}, \"no\" if ${tristateAnalyzerConfig.noCriteria}, or \"unknown\" if ${tristateAnalyzerConfig.unknownCriteria} and give the reason for your response: ${data}`
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "user", "content": prompt},
      ],
      temperature: 0,
      max_tokens: maxTokens,
    });

    // We only look at the first 20 characters to determine the response type since this is a language model and returns different results for the same prompt.
    const answer = response.data.choices[0].message.content.substring(0,19).toLocaleLowerCase();

    return {
      analysis: (answer.includes("yes"))? "yes": (answer.includes("unknown"))? "unknown": (answer.includes("no"))? "no": "error",
      prompt: prompt,
      message: response.data.choices[0].message.content.trim()
    }

  } catch(e) {
    return {
      analysis: "error",
      prompt: prompt,
      message: "Exception: " + e
    }
  }
}

module.exports = { analyze }
