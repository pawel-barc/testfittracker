import fetchWithRefresh from "./fetchWithRefresh";
const getNotifications = async () => {
  const request = await fetchWithRefresh(
    "http://localhost:8080/notifications",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  const response = await request.json();
  return response;
};

const markNotificationAsRead = async (id) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  const response = await request.json();
  return response;
};

export { getNotifications, markNotificationAsRead };
