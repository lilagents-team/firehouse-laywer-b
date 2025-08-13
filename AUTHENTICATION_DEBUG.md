# Authentication Debug Steps

## Current Issue
GitHub authentication not working after enabling Netlify Identity default GitHub integration.

## Debug Steps

### 1. Check Browser Developer Tools
When you click "Sign In with GitHub":
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Click "Sign In with GitHub" 
4. Look for any failed requests or 404 errors
5. Check what URL it's trying to redirect to

### 2. Verify Identity Status
Test these URLs in your browser:
- `https://firehouselawyer.netlify.app/.netlify/identity/settings` (should return JSON)
- `https://firehouselawyer.netlify.app/.netlify/identity` (should show identity status)

### 3. Check GitHub OAuth App Settings
Your GitHub OAuth app should have:
- **Application name**: Any name (e.g., "Firehouse Lawyer CMS")
- **Homepage URL**: `https://firehouselawyer.netlify.app`
- **Authorization callback URL**: `https://api.netlify.com/auth/done`

### 4. Alternative: Delete and Recreate GitHub OAuth App
If the above doesn't work:
1. Delete your current GitHub OAuth app
2. Don't create a new one
3. Try using Netlify's completely default GitHub integration
4. Test authentication again

### 5. Check Netlify Identity Configuration
In Netlify dashboard → Identity → External providers:
- Should show "GitHub (default)" as enabled
- No custom credentials should be entered if using default

## Expected Behavior
1. Click "Sign In with GitHub" in CMS
2. Redirect to GitHub authorization page
3. Authorize the application
4. Redirect back to `https://firehouselawyer.netlify.app/admin` with user logged in

## Common Issues
- **GitHub OAuth app callback URL mismatch**
- **Netlify Identity not fully enabled**
- **CMS configuration pointing to wrong repository**
- **Missing repository permissions on GitHub**

Please follow these debug steps and let me know what you discover!