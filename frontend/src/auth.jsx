export const getAuthHeader = () => {
  const token = localStorage.getItem("access_token"); // <-- "access_token" ব্যবহার করতে হবে
  return { Authorization: token ? `Bearer ${token}` : "" };
};
