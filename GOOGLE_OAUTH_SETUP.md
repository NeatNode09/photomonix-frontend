# Google OAuth Setup Guide

## Overview

The application now uses proper Google OAuth 2.0 authentication flow that matches the backend API specification:

- Frontend obtains Google ID token using `@react-oauth/google`
- ID token is sent to backend `/api/auth/google` endpoint
- Backend validates token and returns user data + JWT tokens

## Setup Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Select **Web application** as application type
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
8. Add authorized redirect URIs (if needed):
   - `http://localhost:5173`
   - `https://yourdomain.com`
9. Copy the **Client ID**

### 2. Configure Environment Variables

Update your `.env` file:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

⚠️ **Important**: Replace `your-actual-client-id` with your real Google Client ID

### 3. Implementation Details

#### Frontend Flow

1. User clicks "Continue with Google" button
2. `GoogleOAuthButton` component renders Google's OAuth button
3. User authenticates with Google
4. Google returns `credential` (ID token)
5. Frontend sends ID token to backend via `POST /api/auth/google`
6. Backend validates token and returns user + JWT tokens
7. Frontend stores tokens and redirects to home page

#### Backend API Contract

```typescript
POST /api/auth/google
Content-Type: application/json

Body:
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200):
{
  "success": true,
  "message": "Login successful" | "Account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "name": "User Name",
      "avatarUrl": "https://lh3.googleusercontent.com/...",
      "emailVerified": true,
      "tokensRemaining": 50,
      "tokensUsed": 0
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token",
      "expiresIn": "15m"
    },
    "isNewUser": false | true
  }
}
```

### 4. Component Structure

- **`GoogleOAuthButton.tsx`**: Reusable Google OAuth button component
- **`AuthContext.tsx`**: Includes `loginWithGoogleToken(idToken)` method
- **`api.ts`**: Includes `googleLogin(idToken)` API function
- **`root.tsx`**: Wrapped with `GoogleOAuthProvider`

### 5. Testing

1. Start the development server: `npm run dev`
2. Navigate to login or register page
3. Click "Continue with Google"
4. Authenticate with your Google account
5. Should redirect to home page if successful

### 6. Error Handling

The component handles these scenarios:

- **Invalid Token (401)**: Shows "Google login failed"
- **Email Conflict (409)**: Shows "Email already registered with email. Please login with email."
- **Network Errors**: Shows "An error occurred during Google login"

### 7. Security Notes

- ✅ Client ID is public and safe to expose in frontend code
- ✅ ID token is validated by backend
- ✅ Tokens are stored in localStorage
- ✅ Refresh tokens are properly managed
- ⚠️ Never expose Client Secret in frontend code

### 8. Production Checklist

- [ ] Add production domain to Google OAuth authorized origins
- [ ] Update `VITE_GOOGLE_CLIENT_ID` in production environment
- [ ] Test OAuth flow in production environment
- [ ] Verify backend token validation is working
- [ ] Configure proper CORS settings

## Troubleshooting

### "Google login failed" error

- Check if `VITE_GOOGLE_CLIENT_ID` is set correctly
- Verify authorized origins include your domain
- Check browser console for detailed errors

### Redirect not working

- Ensure authorized redirect URIs are configured
- Check navigation logic in `GoogleOAuthButton.tsx`

### Backend validation fails

- Verify backend has correct Google Client ID for validation
- Check that ID token is being sent correctly
- Review backend logs for validation errors

## Files Modified

- ✅ `app/components/GoogleOAuthButton.tsx` - New component
- ✅ `app/contexts/AuthContext.tsx` - Added `loginWithGoogleToken` method
- ✅ `app/services/api.ts` - Added `googleLogin` function
- ✅ `app/root.tsx` - Wrapped with `GoogleOAuthProvider`
- ✅ `app/routes/login.tsx` - Uses `GoogleOAuthButton` component
- ✅ `app/routes/register.tsx` - Uses `GoogleOAuthButton` component
- ✅ `.env` - Added `VITE_GOOGLE_CLIENT_ID`
- ✅ `package.json` - Added `@react-oauth/google` dependency
