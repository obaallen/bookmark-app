import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("Checking authentication...");

    // Check if the user is authenticated by calling the /check-auth endpoint
    axios
      .get("http://127.0.0.1:5000/check-auth", { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
        setLoading(false); 
        console.log("response");
        console.log(response.data);
      })
      .catch(() => {
        console.log("Checking authentication3...");
        setIsAuthenticated(false);
        setLoading(false); 
      });
  }, []);

  return { isAuthenticated, loading };
}
