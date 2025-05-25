import * as Yup from "yup";
//Validation pour le formulaire d'inscription dans le composant Register
const registerValidationsSchema = () => {
  //Définition des règles de validation pour le formulaire d'inscription
  return Yup.object({
    //Le champ 'prénom' est requis et doit contenir au moins 3 caractères
    firstName: Yup.string()
      .min(3, "Le prenom doit contenir au moins trois caractères")
      .required("Ce champ est requis"),
    lastName: Yup.string().min(
      3,
      "Le nom de famille doit contenir au moins trois caractères"
    ),
    //Le champ 'email' est requis et doit correspondre au format demandé
    email: Yup.string()
      .email("L'email n'est pas valide")
      .required("Ce champ est requis"),
    //Le champ 'mot de passe' est requis et doit respecter plusieurs critères de complexité
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins huit caractères")
      .matches(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule"
      )
      .matches(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule"
      )
      .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .matches(
        /[\W_]/,
        "Le mot de passe doit contenir au moins un caractère spécial"
      )
      .required("Ce champ est requis"),
    //Le champ 'confirmez le mot de passe' est requis et doit correspondre au champ 'mot de passe'
    repeatPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Les mots de passe ne correspondent pas"
      )
      .required("Veuillez confirmer votre mot de passe"),
    avatar: Yup.mixed().test(
      "fileType",
      "Seuls les formats image sont acceptés",
      (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }
    ),
    gender: Yup.string()
      .oneOf(["male", "female", "non_binary", "other"], "Genre invalide")
      .required("Ce champ est requis"),
    birthDate: Yup.date()
      .max(new Date(), "La date de naissance ne peut pas être dans le futur")
      .required("Ce champ est requis"),
  });
};

export default registerValidationsSchema;
