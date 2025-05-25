import { Link } from "react-router-dom";
//Crée des champs du formulaire permettant à utilisateur de saisir ses données de connexion
//Formik suit les résultats des inputs dynamiquement et informe l'utilisateur en cas d'erreurs.
const LoginForm = ({ formik, errorMessage }) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <h1>Se connecter</h1>
      {/* htmlFor associe un label à un champ de formulaire */}
      <label htmlFor="email">
        Email:
        <input
          type="email"
          name="email"
          id="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
      </label>
      {formik.touched.email && formik.errors.email ? (
        <div className="error">{formik.errors.email}</div>
      ) : null}
      <label htmlFor="password">
        Le mot de passe:
        <input
          type="password"
          name="password"
          id="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="error">{formik.errors.password}</div>
        ) : null}
      </label>
      {/* Affichage des erreurs du formik et du backend */}
      {formik.errors.api && <div className="error">{formik.errors.api}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button
        className="login-btn"
        type="submit"
        disabled={formik.isSubmitting}
      >
        Se connecter
      </button>

      {/* Lien de l'inscription pour un utilisateur non inscrit  */}

      <strong>Pas encore inscrit ?</strong>
      <div className="register-icon">
        <Link to="/register">S'inscrire</Link>
      </div>
    </form>
  );
};

export default LoginForm;
