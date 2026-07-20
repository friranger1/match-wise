import type { VacancyFormData } from '../../../../types/VacancyFormData';
import './VacancyForm.scss';

type Props = {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
  validationErrors: string[];
  setValidationErrors: React.Dispatch<React.SetStateAction<string[]>>;
};

export const VacancyForm: React.FC<Props> = ({
  vacancyForm,
  setVacancyForm,
  validationErrors,
  setValidationErrors,
}) => {
  return (
    <>
      <section className="vacancy__form">
        <div className="vacancy__form--container">
          <h2 className="vacancy__form--header">Input vacancy info</h2>

          <form method="POST" className="vacancy__form--form">
            <div className="vacancy__form--input-container">
              <label className="vacancy__form--label" htmlFor="vacancy-title">
                Vacancy title
              </label>
              <input
                required
                type="text"
                id="vacancy-title"
                className={`vacancy__form--input-title ${
                  validationErrors.includes('title')
                    ? 'vacancy__form--error'
                    : ''
                }`}
                placeholder="e.g. Product Designer"
                value={vacancyForm.title}
                onChange={(event) => {
                  setVacancyForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }));
                }}
                onBlur={() => {
                  setValidationErrors((prev) =>
                    prev.filter((error) => error !== 'title'),
                  );
                }}
              />
            </div>

            <div className="vacancy__form--input-container">
              <label
                className="vacancy__form--label"
                htmlFor="vacancy-description"
              >
                Vacancy description
              </label>
              <textarea
                required
                name="vacancy-description"
                id="vacancy-description"
                className={`vacancy__form--input-description ${
                  validationErrors.includes('description')
                    ? 'vacancy__form--error'
                    : ''
                }`}
                placeholder="Input vacancy description here"
                value={vacancyForm.description}
                onChange={(event) => {
                  setVacancyForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }));
                }}
                onBlur={() => {
                  setValidationErrors((prev) =>
                    prev.filter((error) => error !== 'description'),
                  );
                }}
              ></textarea>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
