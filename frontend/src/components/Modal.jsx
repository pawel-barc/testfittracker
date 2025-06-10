// components/Modal.jsx
const Modal = ({ children, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "min(90%, 500px)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

// Modifications dans Dashboard.jsx
import Modal from "../components/Modal";
import GoalForm from "../components/GoalForm";

// Inside the Dashboard component
const [showGoalForm, setShowGoalForm] = useState(false);

const handleGoalCreated = () => {
  setShowGoalForm(false);
  // Ajoute ici la logique pour rafraîchir les objectifs si nécessaire
};

<button
  onClick={() => setShowGoalForm(true)}
  style={{
    width: "5vw",
    height: "5vw",
    background: "grey",
  }}
>
  <FontAwesomeIcon icon={faBullseye} /> Ajouter un objectif
</button>

{showGoalForm && (
  <Modal onClose={() => setShowGoalForm(false)}>
    <GoalForm onCreated={handleGoalCreated} />
  </Modal>
)};
