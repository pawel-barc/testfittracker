import fetchWithRefresh from "./fetchWithRefresh";

export const getTypes = async () => {
  const res = await fetchWithRefresh("http://localhost:8080/types", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Échec du chargement des types");

  return res.json();
};
