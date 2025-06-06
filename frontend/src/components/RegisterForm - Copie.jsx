import { Link } from "react-router-dom";
import "../../src/style/RegisterForm.css";
import "../../src/style/Global.css";

const RegisterForm = ({ formik, errorMessage }) => (
  <div className="home-container">
    <div className="register-form-wrapper">
      <h1 className="register-form-title">INSCRIPTION</h1>

      <div className="register-form-scroll-container">
        <form onSubmit={formik.handleSubmit} className="register-form">
          <div className="register-input-fields-wrapper">
            <div className="register-display-field-wrapper">
              <label htmlFor="firstName" className="register-form-label">
                Prénom:
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="register-form-input"
                  placeholder="ex. Marine"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="register-error">{formik.errors.firstName}</div>
                )}
              </label>

              <label htmlFor="lastName" className="register-form-label">
                Nom de famille:
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="register-form-input"
                  placeholder="ex. Dupont"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="register-error">{formik.errors.lastName}</div>
                )}
              </label>
            </div>
          </div>


            <div className="register-display-field-wrapper">
              <label htmlFor="gender" className="register-form-label">
                Genre:
                <select
                  name="gender"
                  id="gender"
                  className="register-form-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                >
                  <option value="">Sélectionnez</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="non_binary">Non-binaire</option>
                  <option value="other">Autre</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="register-error">{formik.errors.gender}</div>
                )}
              </label>

              <label htmlFor="birthDate" className="register-form-label">
                Date de naissance:
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  className="register-form-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.birthDate}
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <div className="register-error">{formik.errors.birthDate}</div>
                )}
              </label>
            </div>

          <label htmlFor="email" className="register-form-label">
            Email:
            <input
              type="email"
              name="email"
              id="email"
              className="register-form-input"
              placeholder="ex. marine@gmail.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="register-error">{formik.errors.email}</div>
            )}
          </label>

          <div className="register-display-field-wrapper">
            <label htmlFor="password" className="register-form-label">
              Mot de passe:
              <input
                type="password"
                name="password"
                id="password"
                className="register-form-input"
                placeholder="ex. MotDePasse1?"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="register-error">{formik.errors.password}</div>
              )}
            </label>

            <label htmlFor="repeatPassword" className="register-form-label">
              Confirmez le mot de passe:
              <input
                type="password"
                name="repeatPassword"
                id="repeatPassword"
                className="register-form-input"
                placeholder="ex. MotDePasse1?"
                onChange={formik.handleChange}
                onBlur={() =>
                  formik.setFieldTouched("repeatPassword", true, true)
                }
                value={formik.values.repeatPassword}
              />
              {formik.touched.repeatPassword &&
                formik.errors.repeatPassword && (
                  <div className="register-error">
                    {formik.errors.repeatPassword}
                  </div>
                )}
            </label>
          </div>

          <label htmlFor="avatar" className="register-form-label">
            Photo de profil:
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="register-form-input register-file-input"
              accept="image/*"
              onChange={(event) => {
                formik.setFieldValue("avatar", event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.avatar && formik.errors.avatar && (
              <div className="register-error">{formik.errors.avatar}</div>
            )}
          </label>

          {formik.errors.api && (
            <div className="register-error register-api-error">
              {formik.errors.api}
            </div>
          )}
          {errorMessage && (
            <div className="register-error-message">{errorMessage}</div>
          )}

          <button
            className="register-submit-button"
            type="submit"
            disabled={formik.isSubmitting}
          >
            S'inscrire
          </button>
        </form>
      </div>

      <p className="register-login-prompt">
        <span className="register-login-text">Déjà un compte ? </span>
        <span className="register-login-link">
          <Link to="/login">Connectez-vous</Link>
        </span>
      </p>
    </div>
  </div>
);

export default RegisterForm;
