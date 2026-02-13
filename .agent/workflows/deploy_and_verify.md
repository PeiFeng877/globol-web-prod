---
description: Deploy to Vercel and Verify
---

This workflow guides you through deploying the application to Vercel production and verifying the deployment using command-line tools.

1. **Local Build Verification**
   Always ensure the project builds locally before deploying to avoid wasting remote build minutes or deploying broken code.
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   Use the Vercel CLI to deploy to production. This allows you to watch the build logs in real-time.
   *Note: If you encounter proxy issues, unset proxy variables first.*
   ```bash
   # Option 1: Standard deployment
   // turbo
   vercel --prod

   # Option 2: If proxy issues occur (common in some regions)
   // turbo
   unset http_proxy https_proxy all_proxy && vercel --prod
   ```

3. **Verify Deployment**
   Once deployment is complete, verify the site is accessible and returns the expected status code (200 OK).
   *Replace `https://your-project.vercel.app` with the actual deployment URL provided by the CLI.*
   ```bash
   # Check HTTP Status Code (should be 200)
   // turbo
   curl -I https://your-project.vercel.app

   # Check specific content (e.g., sitemap)
   // turbo
   curl -s https://your-project.vercel.app/sitemap.xml | head -n 5
   ```

4. **Notify User**
   Only after the verification steps pass, inform the user that the deployment is successful and provide the URL.
