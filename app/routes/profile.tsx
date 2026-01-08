import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@contexts/AuthContext";
import { ProtectedRoute } from "@components/ProtectedRoute";

export default function Profile() {
  const { user, getProfile, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      await getProfile();
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const updates: any = {};
    let passwordChanged = false;

    if (name !== user?.name) {
      updates.name = name;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      if (!currentPassword) {
        setError("Current password is required to set a new password");
        return;
      }

      // Use changePassword endpoint for password changes
      setIsLoading(true);
      try {
        const result = await changePassword(currentPassword, newPassword);
        if (result.success) {
          passwordChanged = true;
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setError(result.message || "Failed to change password");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setError("An error occurred while changing password");
        setIsLoading(false);
        return;
      }
    }

    // Update profile name if changed
    if (Object.keys(updates).length > 0) {
      setIsLoading(true);
      try {
        const result = await updateProfile(updates);
        if (!result) {
          setError("Failed to update profile");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setError("An error occurred while updating profile");
        setIsLoading(false);
        return;
      }
    }

    if (Object.keys(updates).length === 0 && !passwordChanged) {
      setError("No changes to save");
      return;
    }

    setSuccess("Profile updated successfully!");
    setIsEditing(false);
    setIsLoading(false);
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg bg-gray-800 shadow-md p-6">
              <p className="text-gray-400">Loading profile...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg bg-gray-800 shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Home
                </button>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                  <p className="text-sm font-medium text-green-800">
                    {success}
                  </p>
                </div>
              )}

              {!isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Name
                    </label>
                    <p className="mt-1 text-lg text-white">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <p className="mt-1 text-lg text-white">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Email Status
                    </label>
                    <p className="mt-1 text-lg">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.emailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.emailVerified
                          ? "Verified"
                          : "Pending Verification"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Token Balance
                    </label>
                    <p className="mt-1 text-lg text-white">
                      {user.tokensRemaining} remaining / {user.tokensUsed} used
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Change Password (Optional)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="Leave empty to skip"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="Leave empty to skip"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Confirm Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="Leave empty to skip"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.name);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError("");
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
