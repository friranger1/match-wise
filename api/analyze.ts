import type { VercelRequest, VercelResponse } from '@vercel/node';

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY не найден на сервере',
    });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Ответь одним предложением: сервер работает?',
                },
              ],
            },
          ],
        }),
      },
    );

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message ?? 'Ошибка Gemini API',
        details: data,
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      message: text ?? 'Gemini вернул пустой ответ',
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Неизвестная ошибка сервера',
    });
  }
}
