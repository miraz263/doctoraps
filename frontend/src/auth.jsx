


export const getAuthHeader = () => {
  const token = localStorage.getItem("access"); // <-- এখানে একই key ব্যবহার করুন
  return { Authorization: token ? `Bearer ${token}` : "" };
};
