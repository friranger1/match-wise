import type { VacancyFormData } from '../../../../types/VacancyFormData';
import './VacancyForm.scss';

type Props = {
  vacancyForm: VacancyFormData;
  setVacancyForm: React.Dispatch<React.SetStateAction<VacancyFormData>>;
};

export const VacancyForm: React.FC<Props> = ({
  vacancyForm,
  setVacancyForm,
}) => {
  return (
    <>
      <section className="vacancy__form">
        <div className="vacancy__form--container">
          <h2 className="vacancy__form--header">Input vacancy info</h2>

          <form action="POST" className="vacancy__form--form">
            <div className="vacancy__form--input-container">
              <label className="vacancy__form--label" htmlFor="vacancy-title">
                Vacancy title
              </label>
              <input
                type="text"
                id="vacancy-title"
                className="vacancy__form--input-title"
                placeholder="Motion designer"
                value={vacancyForm.title}
                onChange={(event) => {
                  setVacancyForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }));
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
                name="vacancy-description"
                id="vacancy-description"
                className="vacancy__form--input-description"
                placeholder="Input vacancy description here"
                value={vacancyForm.description}
                onChange={(event) => {
                  setVacancyForm((prev) => ({
                    ...prev,
                    description: event.target.value,
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
