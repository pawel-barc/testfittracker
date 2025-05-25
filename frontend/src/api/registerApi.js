//Fonction qui envoie les données d'inscription à l'API pour l'enregistrement de l'utilisateur
const registerUser = async (formData) => {
  const request = await fetch("http://localhost:8080/register", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const response = await request.json();
  return response;
};
//Export de la fonction afin qu'elle soit utilisée dans le Register.jsx
export default registerUser;
