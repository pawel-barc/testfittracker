import React from 'react';
import '../style/Home.css'; 
import '../style/Global.css'; 

const AuthScreen = () => {
  return (
    <div className="home-container">
      {/* Titre Bienvenue */}
      <div className="welcome-container">
        <h1 className="welcome-title-wrapper">Bienvenue</h1>
        <p className="welcome-text-wrapper">
          Transforme ton entraînement avec notre plateforme : organise, planifie et dépasse tes limites comme un pro !
        </p>
      </div>
      
      {/* Boutons Connexion/Inscription */}
      <div className="login-register-container">
        <div className="login-div-wrapper">
          <div className="login-text-wrapper">Connexion</div>
        </div>
        <div className="register-wrapper">ou</div>
        <div className="register-div-wrapper">
          <div className="register-text-wrapper">Inscription</div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;