import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { auth } from "@services/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Extract access token from URL
      const token = searchParams.get("token");
      const error = searchParams.get("message");

      if (error) {
        // Handle error
        console.error("Authentication error:", error);
        navigate("/login?error=" + encodeURIComponent(error));
        return;
      }

      if (token) {
        // Store access token
        auth.setAccessToken(token);

        // Fetch user profile
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || "https://api.photomonix.pro/api/auth"}/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include", // Important for cookies
            }
          );

          if (response.ok) {
            const userData = await response.json();
            // Store user data
            if (typeof window !== "undefined") {
              localStorage.setItem("user", JSON.stringify(userData.data.user));
            }

            // Redirect to home
            navigate("/");
          } else {
            throw new Error("Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
          navigate("/login?error=profile_fetch_failed");
        }
      } else {
        // No token received
        navigate("/login?error=no_token");
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-300 text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}
