import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function GoogleOAuthButton() {
  const { loginWithGoogleToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setError("");

    if (credentialResponse.credential) {
      try {
        const result = await loginWithGoogleToken(
          credentialResponse.credential
        );
        if (result.success) {
          navigate("/");
        } else {
          setError(result.message || "Google login failed");
        }
      } catch (err) {
        setError("An error occurred during Google login");
      }
    }
  };

  const handleError = () => {
    setError("Google login failed");
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
