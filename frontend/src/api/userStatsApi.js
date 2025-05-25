import fetchWithRefresh from "./fetchWithRefresh";

const addUserStat = async (values) => {
  const request = await fetchWithRefresh("http://localhost:8080/user-stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    credentials: "include",
  });
  const response = await request.json();
  return response;
};
const getUserStat = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/user-stats", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

export { addUserStat, getUserStat };
