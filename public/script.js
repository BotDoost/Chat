// آدرس API Route در Vercel - بعد از deploy جایگزین کنید
const API_URL = 'https://your-vercel-app.vercel.app/api/chat';

const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const statusDiv = document.getElementById('status');

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = '';
    statusDiv.textContent = 'در حال پردازش...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('خطا در ارتباط با سرور');
        }

        const data = await response.json();
        addMessage('bot', data[0]?.generated_text || 'پاسخی دریافت نشد');
    } catch (error) {
        addMessage('bot', `خطا: ${error.message}`);
    } finally {
        statusDiv.textContent = '';
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
