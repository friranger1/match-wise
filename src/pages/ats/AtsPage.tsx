import { useState } from 'react';
import { VacancyForm } from './components/VacancyForm/VacancyForm';
import type { VacancyFormData } from '../../types/VacancyFormData';
import './AtsPage.scss';
import { CandidateForm } from './components/CandidateForm/CandidateForm';
import type { CandidateFormData } from '../../types/CandidateFormData';
import { analyzeResume } from '../../api/geminiApi';
import { Loader } from '../../shared/components/Loader';
import { Modal } from '../../shared/components/Modal/Modal';

type AtsResponse = Record<string, string>;

export const AtsPage = () => {
  const [vacancyForm, setVacancyForm] = useState<VacancyFormData>({
    title: '',
    description: '',
  });
  const [candidateForm, setCandidateForm] = useState<CandidateFormData>({
    resume: null,
    additionalInfo: '',
  });
  const [loader, setLoader] = useState(false);
  const [response, setResponse] = useState<AtsResponse>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  function validateForm(): string[] {
    const errors: string[] = [];

    if (!vacancyForm.title.trim()) {
      errors.push('title');
    }

    if (!vacancyForm.description.trim()) {
      errors.push('description');
    }

    if (!candidateForm.resume) {
      errors.push('resume');
    }

    return errors;
  }

  const handleAnalyze = async () => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length > 0 || !candidateForm.resume) {
      return;
    }

    setValidationErrors([]);

    setLoader(true);

    try {
      const result = await analyzeResume(
        vacancyForm.title,
        vacancyForm.description,
        candidateForm.resume,
      );

      setResponse(result);
      setIsModalOpen(true);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {isModalOpen && Object.keys(response).length > 0 && (
        <Modal
          response={Object.entries(response)}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <section>
        <div className="ats">
          <div className="ats__forms">
            <VacancyForm
              vacancyForm={vacancyForm}
              setVacancyForm={setVacancyForm}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              />
            <CandidateForm
              candidateForm={candidateForm}
              setCandidateForm={setCandidateForm}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
          </div>
          <button
            type="button"
            className="ats__forms--button"
            onClick={handleAnalyze}
            disabled={loader}
          >
            {loader ? <Loader /> : 'Check with ATS'}
          </button>
        </div>
      </section>
    </>
  );
};
