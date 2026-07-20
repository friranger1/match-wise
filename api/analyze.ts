import type { VercelRequest, VercelResponse } from '@vercel/node';

type AnalyzeRequest = {
  vacancyTitle?: string;
  vacancyDescription?: string;
  resumeBase64?: string;
  mimeType?: string;
};

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

type AtsResponse = Record<string, string>;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY не найден на сервере',
    });
  }

  const { vacancyTitle, vacancyDescription, resumeBase64, mimeType } =
    req.body as AnalyzeRequest;

  if (!vacancyTitle?.trim()) {
    return res.status(400).json({
      error: 'Не указано название вакансии',
    });
  }

  if (!vacancyDescription?.trim()) {
    return res.status(400).json({
      error: 'Не указано описание вакансии',
    });
  }

  if (!resumeBase64) {
    return res.status(400).json({
      error: 'Не передан файл резюме',
    });
  }

  if (mimeType !== 'application/pdf') {
    return res.status(400).json({
      error: 'Резюме должно быть в формате PDF',
    });
  }

  const prompt = `
Ты — профессиональная ATS-система.

Проанализируй приложенное резюме относительно вакансии.

Название вакансии:
${vacancyTitle}

Описание вакансии:
${vacancyDescription}

Не придумывай опыт, навыки или достижения, которых нет в резюме.

Верни только валидный JSON без Markdown, без пояснений и без текста до или после JSON.

Используй строго такую структуру:

{
  "Общая оценка": "Оценка соответствия от 0 до 100 и короткое объяснение.",
  "Сильные стороны": "Главные сильные стороны кандидата относительно вакансии.",
  "Слабые стороны": "Недостающий опыт, навыки и несоответствия.",
  "Недостающие ключевые слова": "Навыки и ключевые слова, которые стоит добавить, только если они действительно соответствуют опыту кандидата.",
  "Рекомендации": "Что изменить или добавить в резюме для повышения соответствия вакансии.",
  "Итог": "Краткий вывод о соответствии кандидата вакансии."
}

Все значения должны быть строками.
Не добавляй новые ключи.
Не используй массивы.
Не используй вложенные объекты.
  `.trim();

  try {
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType,
                    data: resumeBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      },
    );

    const data = (await geminiResponse.json()) as GeminiResponse;

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: data.error?.message ?? 'Ошибка Gemini API',
        details: data,
      });
    }

    const result = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!result) {
      return res.status(502).json({
        error: 'Gemini не вернул текстовый ответ',
      });
    }

    try {
      const parsedResult = JSON.parse(result) as AtsResponse;

      return res.status(200).json(parsedResult);
    } catch {
      return res.status(502).json({
        error: 'Gemini вернул невалидный JSON',
        rawResponse: result,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Неизвестная ошибка сервера',
    });
  }
}
