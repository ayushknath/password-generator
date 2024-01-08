const Modal = ({ status }) => {
  return (
    <div
      className={`modal ${status.message ? "show" : "hide"} ${
        status.state === "success" ? "success" : "error"
      }`}
    >
      <p>{status.message}</p>
    </div>
  );
};

export default Modal;
