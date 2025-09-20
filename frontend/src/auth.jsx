export const getAuthHeader = () => {
  const token = localStorage.getItem("access_token"); // JWT token
  return { Authorization: token ? `Bearer ${token}` : "" };
};
