// src/utils/auth.js
export function logout(navigate) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
}
