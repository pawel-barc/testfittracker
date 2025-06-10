// pages/GoalPage.jsx
import GoalForm from "../components/GoalForm";
import "../style/Global.css";

const GoalPage = () => {
  return (
    <div className="home-container">
      <h1>Ajouter un objectif</h1>
      <GoalForm />
    </div>
  );
};

export default GoalPage;