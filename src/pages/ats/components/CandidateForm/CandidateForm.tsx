import type { CandidateFormData } from '../../../../types/CandidateFormData';
import './CandidateForm.scss';

type Props = {
  candidateForm: CandidateFormData;
  setCandidateForm: React.Dispatch<React.SetStateAction<CandidateFormData>>;
  validationErrors: string[];
  setValidationErrors: React.Dispatch<React.SetStateAction<string[]>>;
};
export const CandidateForm: React.FC<Props> = ({
  candidateForm,
  setCandidateForm,
  validationErrors,
  setValidationErrors,
}) => {
  return (
    <>
      <section className="candidate__form">
        <div className="candidate__form--container">
          <h2 className="candidate__form--header">Input candidate info</h2>

          <form action="POST" className="candidate__form--form">
            <div className="candidate__form--input-container">
              <label className="candidate__form--label" htmlFor="cv-file">
                Candidate CV
              </label>
              <input
                id="cv-file"
                type="file"
                className={`candidate__form--input-file ${
                  validationErrors.includes('resume')
                    ? 'candidate__form--error'
                    : ''
                }`}
                placeholder="Motion designer"
                accept=".pdf,.doc,.docx"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  setCandidateForm((prev) => ({
                    ...prev,
                    resume: file,
                  }));
                }}

                onBlur={() => {
                  setValidationErrors((prev) =>
                    prev.filter((error) => error !== 'resume'),
                  );
                }}
              />
            </div>

            <div className="candidate__form--input-container">
              <label
                className="candidate__form--label"
                htmlFor="additional-info"
              >
                Additional information (optional)
              </label>
              <textarea
                name="additional-info"
                id="additional-info"
                placeholder="Add anything not included in your resume"
                className="candidate__form--input-description"
                value={candidateForm.additionalInfo}
                onChange={(event) => {
                  setCandidateForm((prev) => ({
                    ...prev,
                    additionalInfo: event.target.value,
                  }));
                }}
              ></textarea>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
