import { useFormik } from "formik";
import ProfileForm from "../components/ProfileForm";
import ProfileSummary from "../components/ProfileSummary";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getUserProfile, updateUserProfile } from "../api/userApi";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        setErrorMessage("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      avatar: null,
      gender: "",
      birthDate: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Le prénom est requis"),
      lastName: Yup.string().required("Le nom de famille est requis"),
      email: Yup.string()
        .email("Email invalide")
        .required("L'email est requis"),
      password: Yup.string()
        .test('password-validation', 'Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule, un chiffre et un caractère spécial', function(value) {
          // Si le champ est vide, c'est OK (pas de changement de mot de passe)
          if (!value) return true;
          
          // Si il y a une valeur, elle doit respecter les règles
          return value.length >= 8 && 
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/.test(value);
        }),
      repeatPassword: Yup.string()
        .when("password", {
          is: (val) => val && val.length > 0,
          then: (schema) => schema
            .required("Vous devez confirmer le mot de passe")
            .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre"),
          otherwise: (schema) => schema.notRequired()
        }),
      gender: Yup.string().required("Le genre est requis"),
      birthDate: Yup.date()
        .required("La date de naissance est requise")
        .max(new Date(), "La date de naissance ne peut pas être dans le futur"),
    }),
    onSubmit: async (values) => {
      try {
        const updatedUser = await updateUserProfile(values);
        setUserData(updatedUser);
        alert("Profil mis à jour avec succès!");
      } catch (error) {
        formik.setErrors({ api: error.message || "Erreur lors de la mise à jour du profil" });
      }
    },
  });

  if (isLoading) {
    return <div className="dashboard">Chargement du profil...</div>;
  }

  console.log('userData après mise à jour:', userData);

  return (
    <div className="dashboard">
      {userData ? (
        <ProfileForm formik={formik} errorMessage={errorMessage} userData={userData} />
      ) : (
        <p>Erreur lors du chargement du profil</p>
      )}
      {/* <ProfileSummary user={userData} /> */}
    </div>
  );
};

export default Profile;