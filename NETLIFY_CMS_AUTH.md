# Netlify + Sveltia CMS Authentication Setup

Since your site is hosted on Netlify, you can use Netlify's built-in authentication system with Sveltia CMS. This is much simpler than setting up external OAuth services!

## Quick Setup Steps

### 1. Enable Netlify Identity (CRITICAL)

The 404 error you're seeing usually means Identity isn't properly enabled. Follow these exact steps:

1. Go to your Netlify dashboard
2. Select your site → **Site settings** → **Identity**
3. If you see "Identity is not enabled", click **Enable Identity**
4. **WAIT** for the service to fully initialize (30-60 seconds)
5. Refresh the page and verify you see Identity settings
6. Under **Registration**, set to **Invite only** (recommended for security)
7. Click **Invite users** and add your email address
8. **Test the endpoint**: Visit `https://firehouselawyer.netlify.app/.netlify/identity/settings`
   - Should return JSON configuration (not 404)
   - If 404, Identity isn't properly enabled

### 2. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create new OAuth app with these **EXACT** settings:
   ```
   Application name: Firehouse Lawyer CMS
   Homepage URL: https://firehouselawyer.netlify.app
   Authorization callback URL: https://api.netlify.com/auth/done
   ```
   ⚠️ **Critical**: The callback URL must be exactly `https://api.netlify.com/auth/done`
3. Click **Register application**
4. Click **Generate a new client secret**
5. Copy both **Client ID** and **Client Secret** (you'll need both)

### 3. Configure GitHub Provider in Netlify

1. Back in Netlify: **Site settings** → **Identity** → **External providers**
2. Click **Add provider** and select **GitHub**
3. Enter your GitHub OAuth credentials:
   - **Client ID**: (from step 2)
   - **Client Secret**: (from step 2)
4. Click **Save**
5. **Verify**: You should see GitHub listed as an enabled provider

### 4. Update Repository Reference

Edit `public/admin/config.yml` and replace the repository placeholder:

```yaml
backend:
  name: github
  repo: YOUR-USERNAME/YOUR-REPO-NAME  # Replace with actual GitHub repo
  branch: main
  base_url: https://api.netlify.com
  auth_endpoint: auth
```

## Testing Authentication

1. Deploy your site to Netlify (or let auto-deploy finish)
2. Visit `https://your-site.netlify.app/admin`
3. Click **Login with Netlify Identity**
4. You should be redirected to GitHub for authorization
5. After authorizing, you'll be redirected back to the CMS interface

## Troubleshooting

**"Authentication aborted. Please try again."** (Your current issue):
- Identity is enabled ✅ but GitHub OAuth is not configured
- You need to create a GitHub OAuth app and add it to Netlify Identity
- **Solution**: Complete steps 2 and 3 above to set up GitHub OAuth
- **Check**: In Netlify Identity settings, GitHub should be listed under External providers

**"Error: Failed to authenticate"**:
- Verify GitHub OAuth callback URL is exactly: `https://api.netlify.com/auth/done`
- Check that you've enabled Netlify Identity
- Ensure you've been invited as a user in Netlify Identity

**"Repository not found"**:
- Verify the repository name in config.yml matches your GitHub repo exactly
- Ensure your GitHub account has access to the repository
- Check that the repository is public or that your OAuth app has the right permissions

**"Access denied"**:
- Make sure you've been invited as a user in Netlify Identity
- Check that the GitHub OAuth app belongs to the same account/organization as the repository

**If Identity still doesn't work after enabling**:
1. **Disable Identity** in Netlify dashboard
2. Wait 30 seconds
3. **Re-enable Identity**
4. Test the settings endpoint again
5. This forces a fresh Identity service instance

## What This Setup Provides

✅ **Secure authentication** through Netlify Identity + GitHub OAuth
✅ **Direct GitHub integration** for content management
✅ **No external services** required (everything through Netlify)
✅ **Automatic deployments** when content is saved through the CMS

That's it! Your CMS should now work properly with GitHub authentication through Netlify.