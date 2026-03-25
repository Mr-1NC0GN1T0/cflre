let chatHistory = [];

export default {
  async fetch(request, env) {

    if (request.method === "POST") {
      const userMessage = await request.text();

      chatHistory.push({ role: "user", content: userMessage });

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct",
        {
          messages: chatHistory
        }
      );

      chatHistory.push({
        role: "assistant",
        content: aiResponse.response
      });

      return new Response(aiResponse.response);
    }

    return new Response("AI is running!");
  }
};
