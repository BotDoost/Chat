// آدرس API Route در Vercel - بعد از deploy جایگزین کنید
const API_URL = 'https://chat-liard-eight.vercel.app/api/chat';

const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const statusDiv = document.getElementById('status');

// تابع کمکی برای لاگ کردن مراحل
function logStep(step, details = '') {
    console.log(`[Step ${step}] ${details}`);
    // همچنین می‌توانید این اطلاعات را در صفحه هم نمایش دهید
    const logDiv = document.createElement('div');
    logDiv.classList.add('log-message');
    logDiv.textContent = `[Debug] Step ${step}: ${details}`;
    chatContainer.appendChild(logDiv);
}

function addMessage(role, content) {
    logStep(1, `Adding ${role} message: ${content}`);
    try {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${role}-message`);
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        logStep(1.1, `Message added successfully`);
    } catch (error) {
        logStep(1.2, `Error adding message: ${error.message}`);
        throw error;
    }
}

async function sendMessage() {
    logStep(2, 'sendMessage function started');
    const message = userInput.value.trim();
    
    if (!message) {
        logStep(2.1, 'Empty message, returning');
        return;
    }

    try {
        logStep(3, `Processing message: "${message}"`);
        addMessage('user', message);
        userInput.value = '';
        statusDiv.textContent = 'در حال پردازش...';

        logStep(4, 'Preparing fetch request');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        };
        logStep(4.1, `Request options: ${JSON.stringify(requestOptions)}`);

        logStep(5, 'Sending request to API');
        const response = await fetch(API_URL, requestOptions);
        logStep(5.1, `Received response, status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            logStep(5.2, `Response not OK. Status: ${response.status}, Text: ${errorText}`);
            throw new Error(`خطا در ارتباط با سرور: ${response.status} - ${errorText}`);
        }

        logStep(6, 'Parsing response JSON');
        const data = await response.json();
        logStep(6.1, `Parsed data: ${JSON.stringify(data)}`);

        const botResponse = data[0]?.generated_text || 'پاسخی دریافت نشد';
        logStep(7, `Bot response: ${botResponse}`);
        addMessage('bot', botResponse);

    } catch (error) {
        logStep('ERROR', `Caught error: ${error.message}`);
        console.error('Full error:', error);
        addMessage('bot', `خطا: ${error.message}`);
    } finally {
        statusDiv.textContent = '';
        logStep(8, 'Request completed');
    }
}

// اضافه کردن لاگ برای رویدادها
logStep(0, 'Script initialized');
sendButton.addEventListener('click', () => {
    logStep('click', 'Send button clicked');
    sendMessage();
});
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        logStep('keypress', 'Enter key pressed');
        sendMessage();
    }
});
