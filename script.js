async function sendMessage() {
   const input = document.getElementById("userInput");
   const chatbox = document.getElementById("chatbox");

   const userMessage = input.value.trim();
   if (!userMessage) return;

   // Display user message
   const userBubble = `<div class="d-flex"><div class="message user">${userMessage}</div></div>`;
   chatbox.innerHTML += userBubble;
   chatbox.scrollTop = chatbox.scrollHeight;
   input.value = "";

   // Optional: Show loading text
   const loadingId = `loading-${Date.now()}`;
   const loadingBubble = `<div id="${loadingId}" class="d-flex"><div class="message bot">Typing...</div></div>`;
   chatbox.innerHTML += loadingBubble;
   chatbox.scrollTop = chatbox.scrollHeight;

   try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
         method: "POST",
         headers: {
            "Authorization": "Bearer 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",
            "HTTP-Referer": "https://www.aichatwebsite.com",
            "X-Title": "aichatwebsite",
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [
               {
                  role: "user",
                  content: userMessage
               }
            ]
         })
      });

      const data = await response.json();

      // Remove loading
      document.getElementById(loadingId)?.remove();

      if (data.choices && data.choices.length > 0) {
         const botMessage = data.choices[0].message.content;
         const botHtml = marked.parse(botMessage);
         const botBubble = `<div class="d-flex"><div class="message bot">${botHtml}</div></div>`;
         chatbox.innerHTML += botBubble;

      } else {
         chatbox.innerHTML += `<div class="d-flex"><div class="message bot">No response from server.</div></div>`;
      }
   } catch (error) {
      document.getElementById(loadingId)?.remove();
      chatbox.innerHTML += `<div class="d-flex"><div class="message bot">Error contacting server.</div></div>`;
      console.error(error);
   }

   chatbox.scrollTop = chatbox.scrollHeight;
}
