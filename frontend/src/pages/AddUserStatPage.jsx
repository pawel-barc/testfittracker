import AddUserStatForm from "../components/AddUserStatForm";
import { useNavigate } from "react-router-dom";

const AddUserStatPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate(-1)}>🔙 Retour</button>
      <h1>Ajouter des statistiques</h1>
      <AddUserStatForm
        onStatAdded={() => {
          alert("Statistiques ajoutées !");
          navigate("/");
        }}
      />
    </div>
  );
};

export default AddUserStatPage;
