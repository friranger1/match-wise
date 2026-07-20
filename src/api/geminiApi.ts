import axios from 'axios';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const url =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Не удалось прочитать файл'));
        return;
      }

      const base64 = reader.result.split(',')[1];

      if (!base64) {
        reject(new Error('Не удалось преобразовать файл в Base64'));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'));
    };
  });
}

type AtsResponse = Record<string, string>;

export async function analyzeResume(
  vacancyTitle: string,
  vacancyDescription: string,
  resumeFile: File,
): Promise<AtsResponse> {
  if (!apiKey) {
    throw new Error('Gemini API key не найден');
  }

  if (!resumeFile) {
    throw new Error('Файл резюме не выбран');
  }

  if (resumeFile.type !== 'application/pdf') {
    throw new Error('Резюме должно быть в формате PDF');
  }

  console.log(apiKey?.slice(0, 8));
  console.log(apiKey?.length);
  const base64File = await fileToBase64(resumeFile);

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

  const response = await axios.post<GeminiResponse>(
    url,
    {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: resumeFile.type,
                data: base64File,
              },
            },
          ],
        },
      ],
    },
    {
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = response.data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('');

  if (!result) {
    throw new Error('Не вернул текстовый ответ');
  }

  try {
    return JSON.parse(result) as AtsResponse;
  } catch {
    throw new Error('Невалидный JSON');
  }
}
