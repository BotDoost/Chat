// آدرس API Route در Vercel
const API_URL = 'https://chat-liard-eight.vercel.app/api/chat';

const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const statusDiv = document.getElementById('status');

// تابع برای نمایش لاگ‌ها در صفحه
function showDebugLog(message) {
    const debugLog = document.createElement('div');
    debugLog.className = 'debug-log';
    debugLog.textContent = `[Debug] ${message}`;
    chatContainer.appendChild(debugLog);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addMessage(role, content) {
    showDebugLog(`Adding ${role} message: ${content.substring(0, 50)}...`);
    try {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        showDebugLog(`Error in addMessage: ${error.message}`);
        throw error;
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) {
        showDebugLog("Message is empty, not sending");
        return;
    }

    showDebugLog("Starting sendMessage function");
    addMessage('user', message);
    userInput.value = '';
    statusDiv.textContent = 'در حال پردازش...';

    try {
        showDebugLog("Preparing request to server");
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        };
        
        showDebugLog(`Sending to ${API_URL}`);
        const response = await fetch(API_URL, requestOptions);
        showDebugLog(`Received response, status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            showDebugLog(`Server error: ${response.status} - ${errorText}`);
            throw new Error(`سرور پاسخ نامعتبر داد: ${response.status}`);
        }

        const data = await response.json();
        showDebugLog(`Response data: ${JSON.stringify(data).substring(0, 100)}...`);
        
        // اصلاح شده برای مدیریت پاسخ‌های مختلف
        let botResponse = 'پاسخی دریافت نشد';
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
            botResponse = data[0].generated_text;
        } else if (data.generated_text) {
            botResponse = data.generated_text;
        } else if (data.message) {
            botResponse = data.message;
        }
        
        showDebugLog(`Extracted bot response: ${botResponse}`);
        addMessage('bot', botResponse);

    } catch (error) {
        showDebugLog(`ERROR: ${error.message}`);
        addMessage('bot', `خطا در ارتباط: ${error.message}`);
    } finally {
        statusDiv.textContent = '';
        showDebugLog("Request completed");
    }
}

// مقداردهی اولیه
showDebugLog("سیستم چت آماده است");
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// استایل برای لاگ‌های دیباگ
const style = document.createElement(
