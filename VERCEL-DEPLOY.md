# Deploy Python Everyday on Vercel

The website is static HTML, CSS, JavaScript, and SVG. No Python server, package installation, or build is needed.

## Required files in the connected Git repository

Keep this layout in the repository:

```text
vercel.json
dist/
  index.html
  style.css
  app.js
  course.js
  qa.js
  assets/
```

The local repository previously had only README.md committed. Untracked local files are not included when Vercel deploys from Git. Commit and push the website files and configuration to the branch connected to the Vercel project:

```text
git add dist vercel.json VERCEL-DEPLOY.md
git commit -m "Include Python website and configure Vercel static output"
git push
```

Run these commands from the repository folder containing vercel.json. Check your remote and connected deployment branch before pushing.

## Vercel project settings

- Framework Preset: Other.
- Root Directory: the repository folder containing vercel.json and dist. Leave this blank if they are at the repository root. If the repository contains a python-everyday subfolder holding them, set Root Directory to python-everyday.
- Build Command: empty (skip build).
- Install Command: empty (no dependencies).
- Output Directory: dist, relative to the selected Root Directory.

The supplied vercel.json sets the framework, commands, and output directory. The Root Directory must still point to the correct folder in Vercel.

After pushing, verify that the new deployment uses that new commit. Redeploying the earlier README-only commit will still omit the website.

## Check the deployment

Open the deployment origin, then a lesson URL such as https://YOUR-DOMAIN/#lesson/strings. Lessons use hash routing: the part after # is handled by the browser, so this site does not need a catch-all server rewrite.

Confirm index.html, style.css, app.js, course.js, qa.js, and the assets directory are present in the deployment output. If the origin still shows 404, inspect the deployment's source commit, Root Directory, and Output Directory before changing routing.

## Using the Vercel-ready ZIP

Extract python-everyday-vercel.zip and upload its contents to the repository root. It contains vercel.json and dist together. Do not put only the ZIP file in the Git repository: Vercel needs the extracted website files.

Official references:

- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/kb/guide/why-is-my-deployed-project-giving-404
