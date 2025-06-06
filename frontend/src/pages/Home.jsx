import { Link } from 'react-router-dom'; // Import du Link
import '../style/Home.css'; 
import '../style/Global.css'; 

const AuthScreen = () => {
  return (
    <div className="home-container">
      {/* Titre Bienvenue */}
      <div className="welcome-container">
        <h1 className="welcome-title-wrapper">Bienvenue sur Fitrack</h1>
        <p className="welcome-text-wrapper">
          Transforme ton entraînement avec notre plateforme : organise, planifie et dépasse tes limites comme un pro !
        </p>
      </div>
      
      {/* Boutons Connexion/Inscription */}
      <div className="login-register-container">
        <Link to="/login" className="login-div-wrapper"> {/* Lien vers /login */}
          Connexion
        </Link>
        <div className="register-wrapper">ou</div>
        <Link to="/register" className="register-div-wrapper"> {/* Lien vers /register */}
          Inscription
        </Link>
      </div>
    </div>
  );
};

export default AuthScreen;
