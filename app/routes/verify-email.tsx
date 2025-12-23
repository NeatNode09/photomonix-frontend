import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token]);

  const handleVerifyEmail = async () => {
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyEmail(token);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Invalid or expired verification token");
        setShowResend(true);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      setShowResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await resendVerification(email);
      if (result) {
        setSuccess(true);
        setShowResend(false);
      } else {
        setError("Failed to resend verification email");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We sent a verification link to your email. Click the link or enter
            your email to resend it.
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              {token
                ? "Email verified successfully!"
                : "Verification email sent! Please check your inbox."}
            </p>
          </div>
        ) : null}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {isLoading && !success && (
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-2 text-gray-400">Verifying your email...</p>
          </div>
        )}

        {!token && !success && (
          <form className="mt-8 space-y-6" onSubmit={handleResendVerification}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Resend verification email"}
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center text-sm">
            <span className="text-gray-400">Already verified? </span>
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
