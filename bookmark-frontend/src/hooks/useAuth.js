import { useState, useEffect } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Current cookies:', document.cookie); // Debug cookies
        const request = new Request('http://127.0.0.1:5000/check-auth', {
          method: 'GET',
          credentials: 'include'
        });
        console.log('Request details:', {
          url: request.url,
          method: request.method,
          credentials: request.credentials,
          headers: [...request.headers.entries()]
        });
        const response = await fetch(request);
        console.log('Auth check response:', {
          status: response.status,
          headers: [...response.headers.entries()],
          ok: response.ok
        });
        const data = await response.json();
        console.log('Auth check data:', data);
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        console.log('Auth check complete. Loading:', false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}

export default useAuth;
