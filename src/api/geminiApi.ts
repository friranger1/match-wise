import axios from 'axios';

type AtsResponse = Record<string, string>;

type ApiErrorResponse = {
  error?: string;
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

export async function analyzeResume(
  vacancyTitle: string,
  vacancyDescription: string,
  resumeFile: File,
): Promise<AtsResponse> {
  if (!resumeFile) {
    throw new Error('Файл резюме не выбран');
  }

  if (resumeFile.type !== 'application/pdf') {
    throw new Error('Резюме должно быть в формате PDF');
  }

  const resumeBase64 = await fileToBase64(resumeFile);

  try {
    const response = await axios.post<AtsResponse>('/api/analyze', {
      vacancyTitle,
      vacancyDescription,
      resumeBase64,
      mimeType: resumeFile.type,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.error ?? 'Не удалось выполнить анализ резюме',
      );
    }

    throw error;
  }
}
