import { useFormik } from "formik";
import registerUser from "../api/registerApi";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useState } from "react";
import registerValidationsSchema from "../validations/registerValidationShema";
import expandArrow from "../assets/images/expand-arrow.png";
import image from "../assets/images/logo-fitrack.png";
// import "../style/Register.css";
import vector1 from "../assets/images/vector-background.svg";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      avatar: "",
      gender: "",
      birthDate: "",
    },
    validationSchema: registerValidationsSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        const formData = new FormData();
        formData.append("first_name", values.firstName);
        if (values.lastName) {
          formData.append("last_name", values.lastName);
        }
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("repeatPassword", values.repeatPassword);
        formData.append("gender", values.gender);
        formData.append("birth_date", values.birthDate);
        if (values.avatar) {
          formData.append("avatar", values.avatar);
        }

        const apiResponse = await registerUser(formData);

        if (apiResponse.success) {
          console.log(apiResponse);
          login();
          navigate("/");
        } else if (apiResponse.error) {
          setErrorMessage(apiResponse.error);
        }
      } catch (error) {
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });

  return (
    <div className="login">
      <div className="overlap-group">
        <div className="frame">
          <img className="vector" alt="Vector" src={vector1} />
        </div>

        <div className="frame-wrapper">
          <div className="div">
            <div className="text-wrapper">INSCRIPTION</div>

            <form onSubmit={formik.handleSubmit} className="frame-2">
              {/* Prénom */}
              <div className="frame-2">
                <input
                  className="frame-3"
                  id="firstName"
                  name="firstName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  placeholder=" "
                />
                <label className="text-wrapper-2">Prénom</label>
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="error-message">{formik.errors.firstName}</div>
                )}
              </div>

              {/* Nom de famille */}
              <div className="frame-2">
                <input
                  className="frame-3"
                  id="lastName"
                  name="lastName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  placeholder=" "
                />
                <label className="text-wrapper-2">Nom de famille</label>
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="error-message">{formik.errors.lastName}</div>
                )}
              </div>

              {/* Sexe et autres informations */}
              <div className="frame-4">
                <div className="frame-5">
                  <div className="expand-arrow-wrapper">
                    <img className="expand-arrow" alt="Expand arrow" src={expandArrow} />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                    className="text-wrapper-3"
                  >
                    <option value="">Sexe</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="frame-6">
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.birthDate}
                    className="text-wrapper-3"
                    placeholder="Âge"
                  />
                  <div className="img-wrapper">
                    <img className="img" alt="Expand arrow" src={image} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="frame-2">
                <input
                  className="frame-3"
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder=" "
                />
                <label className="text-wrapper-2">E-mail</label>
                {formik.touched.email && formik.errors.email && (
                  <div className="error-message">{formik.errors.email}</div>
                )}
              </div>

              {/* Mot de passe */}
              <div className="frame-2">
                <input
                  className="frame-3"
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder=" "
                />
                <label className="text-wrapper-2">Mot de passe</label>
                {formik.touched.password && formik.errors.password && (
                  <div className="error-message">{formik.errors.password}</div>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div className="frame-2">
                <input
                  className="frame-3"
                  id="repeatPassword"
                  name="repeatPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.repeatPassword}
                  placeholder=" "
                />
                <label className="text-wrapper-2">Confirmez le mot de passe</label>
                {formik.touched.repeatPassword && formik.errors.repeatPassword && (
                  <div className="error-message">{formik.errors.repeatPassword}</div>
                )}
              </div>

              {/* Avatar */}
              <div className="frame-2">
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={(event) => {
                    formik.setFieldValue("avatar", event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                  className="frame-3"
                />
                <label className="text-wrapper-2">Photo de profil</label>
              </div>

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <button type="submit" className="div-wrapper">
                <div className="frame-7">
                  <div className="text-wrapper-4">S'inscrire</div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="frame-8">
        <div className="frame-9" />
      </div>
    </div>
  );
};

export default Register;