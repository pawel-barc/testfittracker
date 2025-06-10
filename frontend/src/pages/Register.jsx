import RegisterForm from "../components/RegisterForm";
import registerValidationsSchema from "../validations/registerValidationShema";
import { useFormik } from "formik";
import registerUser from "../api/registerApi";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useState } from "react";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  // Récupération de la fonction login depuis le 'AuthStore' pour mettre à jour l'état de connexion après l'inscription
  const login = useAuthStore((state) => state.login);
  //Initialisation du formulaire avec Formik
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
    //Appel de l'API pour l'enregistrement de l'utilisateur
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
          login(apiResponse.user);
          navigate("/");
        } else if (apiResponse.error) {
          setErrorMessage(apiResponse.error);
        }
      } catch (error) {
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });
  //Retourne le formulaire d'inscription avec le prop du formik
  return <RegisterForm formik={formik} errorMessage={errorMessage} />;
};

export default Register;
