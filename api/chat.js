export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'فقط درخواست POST مجاز است' });
  }

  try {
    const { message } = req.body;
    const response = await fetch('https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HF_TOKEN}`
      },
      body: JSON.stringify({ inputs: message })
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'خطا در ارتباط با Hugging Face API' });
  }
}
