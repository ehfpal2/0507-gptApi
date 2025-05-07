const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 대화 맥락을 저장할 배열
let conversationHistory = [];

async function fetchGPTResponse() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: conversationHistory,  // 대화 맥락 포함
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// 질문 보내는 함수
async function sendMessage() {
  const prompt = userInput.value;
  if (!prompt) return;

  // 사용자 메시지 채팅창에 추가
  chatbox.innerHTML += `<div class="text-right mb-2 text-blue-600">나: ${prompt}</div>`;
  userInput.value = '';
  chatbox.scrollTop = chatbox.scrollHeight;

  // 대화에 사용자 메시지 추가
  conversationHistory.push({ role: "user", content: prompt });

  // GPT의 응답 받아오기
  const reply = await fetchGPTResponse();

  // 대화에 GPT 응답 추가
  conversationHistory.push({ role: "assistant", content: reply });

  // GPT의 응답을 채팅창에 추가
  chatbox.innerHTML += `<div class="text-left mb-2 text-gray-800">GPT: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 버튼 클릭 이벤트
sendBtn.addEventListener('click', sendMessage);

// 엔터키로 메시지 전송
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();  // 새 줄 추가 방지
    sendMessage();
  }
});
