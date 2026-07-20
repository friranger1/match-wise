import './Modal.scss';
type Props = {
  response: [string, string][];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal: React.FC<Props> = ({ response, setIsModalOpen }) => {
  return (
    <>
      <div className="modal">
        <button
          className="modal__button-close"
          onClick={() => {
            setIsModalOpen(false);
          }}
        ></button>
        {response.map((elem) => {
          return (
            <>
              <h2>{elem[0]}</h2>
              <p>{elem[1]}</p>
            </>
          );
        })}
      </div>
    </>
  );
};
