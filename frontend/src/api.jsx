const BASE_URL = "http://localhost:8000/";

export const loginUser = async (username, password, role) => {
  const response = await fetch(`${BASE_URL}api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  return response.json();
};

export const registerUser = async (username, email, password, role) => {
  const response = await fetch(`${BASE_URL}api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  });
  return response.json();
};
