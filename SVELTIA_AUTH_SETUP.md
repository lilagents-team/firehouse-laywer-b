# Sveltia CMS Authentication Setup Guide

## Why You Need This

Sveltia CMS requires a separate OAuth authentication service when not hosted on Netlify. Unlike Netlify/Decap CMS which provides built-in authentication, Sveltia CMS needs you to set up your own GitHub OAuth service.

## Recommended Solution: Cloudflare Workers (FREE)

The easiest and most reliable method is using Cloudflare Workers, which offers:
- ✅ **Free tier**: 100,000 requests/day (more than enough for CMS usage)
- ✅ **Official support**: Created by Sveltia CMS team
- ✅ **Easy setup**: One-click deployment
- ✅ **Reliable**: Global CDN with 99.9% uptime

## Step-by-Step Setup

### Step 1: Deploy to Cloudflare Workers

1. **Sign up for Cloudflare** (free account)
2. **Click this deployment button**: 
   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-auth)

3. **Follow the deployment process**:
   - Authorize GitHub access
   - Select your Cloudflare account
   - Deploy the worker

4. **Copy your Worker URL**: `https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev`

### Step 2: Create GitHub OAuth App

1. **Go to GitHub**: [Settings → Developer settings → OAuth Apps](https://github.com/settings/applications/new)

2. **Register new OAuth app** with these settings:
   ```
   Application name: Firehouse Lawyer CMS
   Homepage URL: https://your-netlify-site.netlify.app
   Authorization callback URL: https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev/callback
   ```

3. **Generate client secret** and copy both:
   - Client ID
   - Client Secret

### Step 3: Configure Cloudflare Worker

1. **Go to Cloudflare Dashboard** → Workers & Pages → `sveltia-cms-auth`

2. **Navigate to Settings** → Variables

3. **Add these Environment Variables**:
   ```
   GITHUB_CLIENT_ID: [your-client-id-from-step-2]
   GITHUB_CLIENT_SECRET: [your-client-secret] (click Encrypt)
   ALLOWED_DOMAINS: your-netlify-site.netlify.app
   ```

4. **Save and Deploy**

### Step 4: Update CMS Configuration

I'll update your `public/admin/config.yml` to include the authentication service.

**You'll need to replace `YOUR-WORKER-URL` with your actual Cloudflare Worker URL from Step 1.**

## Alternative: Community Solutions

If you prefer not to use Cloudflare Workers, here are other options:

### Railway/Vercel Deployment
- Deploy the same code to Railway or Vercel
- Configure OAuth app to point to your deployment
- More complex but gives you full control

### Use Existing OAuth Service
- Some developers provide public OAuth services
- ⚠️ **Security risk**: Your GitHub tokens go through third-party servers
- Not recommended for production use

## Next Steps

1. **Complete the Cloudflare Workers setup** above
2. **Update the CMS config** with your Worker URL (I'll help with this)
3. **Test authentication** at your-site.netlify.app/admin
4. **Start editing content** with full GitHub integration!

## Troubleshooting

### Common Issues

**"OAuth Error" or 404 on login**:
- Verify callback URL matches exactly: `https://your-worker.workers.dev/callback`
- Check environment variables are set correctly
- Ensure your site domain is in ALLOWED_DOMAINS

**"Access Denied" errors**:
- Verify GitHub OAuth app is for the correct repository
- Check that your GitHub account has access to the repository
- Ensure OAuth app permissions are correct

**Worker not responding**:
- Check Cloudflare Workers dashboard for error logs
- Verify the worker is deployed and running
- Test the worker URL directly in browser

### Getting Help

- Check Cloudflare Workers logs in dashboard
- Verify GitHub OAuth app callback URL
- Test authentication flow step by step
- Ensure all environment variables are correctly set

Once this is set up, you'll have a fully functional CMS with GitHub authentication that works perfectly with your Netlify deployment!