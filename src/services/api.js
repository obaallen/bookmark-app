const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
}

export async function signupUser(email, password) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Signup failed");
  }
  return response.json();
}

export async function getBookmarks() {
  const response = await fetch(`${API_URL}/bookmarks`);
  if (!response.ok) {
    throw new Error("Could not fetch bookmarks");
  }
  return response.json();
}

