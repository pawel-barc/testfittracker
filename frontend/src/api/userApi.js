import fetchWithRefresh from "./fetchWithRefresh";

const getUserProfile = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/users/profile", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

const updateUserProfile = async (values) => {
  const formData = new FormData();
  
  // Ajouter les champs texte
  formData.append('firstName', values.firstName);
  formData.append('lastName', values.lastName);
  formData.append('email', values.email);
  formData.append('gender', values.gender);
  formData.append('birthDate', values.birthDate);
  
  // Ajouter le fichier avatar s'il existe
  if (values.avatar) {
    formData.append('avatar', values.avatar);
  }

  const request = await fetchWithRefresh("http://localhost:8080/users/profile", {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

const updateUserPassword = async (currentPassword, newPassword) => {
  const request = await fetchWithRefresh("http://localhost:8080/users/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

export { getUserProfile, updateUserProfile, updateUserPassword };