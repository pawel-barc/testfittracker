import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import LoginUser from "../api/loginApi";
import useAuthStore from "../store/AuthStore";
import { useState } from "react";
import "./style/Login.css";
import vector1 from "./vector-1.svg";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email est invalide")
        .required("Ce champ est requis "),
      password: Yup.string().required("Ce champ est requis"),
    }),
    onSubmit: async (values, { setErrors }) => {
      try {
        const apiResponse = await LoginUser(values);
        if (apiResponse.success) {
          console.log(apiResponse);
          login();
          navigate("/");
        } else if (apiResponse.error) {
          setErrorMessage(apiResponse.error);
        }
      } catch (error) {
        console.error("Erreur capturée:", error);
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
            <div className="text-wrapper">CONNEXION</div>

            <form onSubmit={formik.handleSubmit} className="frame-2">
              <div className="frame-3">
                <div className="text-wrapper-2">E-mail</div>
                <input
                  className="frame-4"
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-message">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="frame-5">
                <div className="text-wrapper-2">Mot de passe</div>
                <input
                  className="frame-4"
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="error-message">{formik.errors.password}</div>
                ) : null}
              </div>

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <button type="submit" className="div-wrapper">
                <div className="text-wrapper-3">Se connecter</div>
              </button>
            </form>

            <p className="pas-de-compte">
              <span className="span">Pas de compte ? </span>
              <span className="text-wrapper-4">Inscrivez-vous</span>
            </p>
          </div>
        </div>
      </div>

      <div className="frame-6">
        <div className="frame-7" />
      </div>
    </div>
  );
};

export default Login;