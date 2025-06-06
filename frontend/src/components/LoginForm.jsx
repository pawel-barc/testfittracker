import { Link } from "react-router-dom";
import "../../src/style/LoginForm.css";
import "../../src/style/Global.css";

const LoginForm = ({ formik, errorMessage }) => {
  return (
    <div className="home-container">
      <div className="login-form-wrapper">
        <form onSubmit={formik.handleSubmit} className="login-form">
          <h1 className="login-form-title">CONNEXION</h1>

          <div className="input-fields-wrapper">
            <div className="email-input-container">
              <label htmlFor="email" className="email-label">
                E-mail
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="email-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </label>
              {formik.touched.email && formik.errors.email && (
                <div className="error">{formik.errors.email}</div>
              )}
            </div>

            <div className="password-input-container">
              <label htmlFor="password" className="password-label">
                Mot de passe
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="password-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </label>
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>
          </div>

          {formik.errors.api && <div className="error">{formik.errors.api}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button
            className="login-button"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Se connecter
          </button>

          <p className="register-prompt">
            <span className="register-text">Pas de compte ? </span>
            <span className="register-login-link">
              <Link to="/register">Inscrivez-vous</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
