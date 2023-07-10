export async function chat (message, client, openai) {
  let conversationLog = [{ role: 'system', content: "You are a funny sarcastic chatbot. You regularly quote star wars memes, history memes, and are occasionally extremely rude. "}];

  await message.channel.sendTyping();

  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
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
}