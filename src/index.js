export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const { prompt, userId } = await request.json();
      const historyKey = `chat-${userId || 'guest'}`;

      // 1. Retrieve memory (last 5 messages)
      let history = await env.CHAT_HISTORY.get(historyKey, { type: "json" }) || [];

      // 2. Call Llama 3.3
      const aiResponse = await env.AI.run("@cf/meta/llama-3.3-70b-instruct", {
        messages: [
          { role: "system", content: "You are a professional AI assistant built for the Cloudflare assignment." },
          ...history,
          { role: "user", content: prompt }
        ]
      });

      // 3. Update memory
      history.push({ role: "user", content: prompt });
      history.push({ role: "assistant", content: aiResponse.response });
      await env.CHAT_HISTORY.put(historyKey, JSON.stringify(history.slice(-10)));

      return new Response(JSON.stringify({ answer: aiResponse.response }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("CFL_AI Project is running. Send a POST request to chat!");
  }
};