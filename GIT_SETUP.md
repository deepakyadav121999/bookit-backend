# How to Create New GitHub Repo

## Your files are safe! Just need to connect to a new repo.

### Step 1: Create New Repo on GitHub

1. Go to: https://github.com/new
2. Repository name: `bookit-backend` (or any name you want)
3. **Keep it Public** (or Private if you prefer)
4. **DON'T** check "Initialize with README" (you already have files)
5. Click "Create repository"

### Step 2: Connect Your Local Code

GitHub will show you commands. Use these:

```bash
# Remove old remote (if exists)
git remote remove origin

# Add your new repo
git remote add origin https://github.com/YOUR_USERNAME/bookit-backend.git

# Push everything
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Done!

Your code is now on GitHub at:
```
https://github.com/YOUR_USERNAME/bookit-backend
```

---

## OR Use These Quick Commands

```bash
# 1. Remove old remote
git remote remove origin

# 2. Add new remote (replace with YOUR repo URL)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 3. Push
git push -u origin master
```

---

## Current Status Check

Run this to see what's committed:
```bash
git log --oneline
```

Run this to see current remote:
```bash
git remote -v
```

---

## Starting Fresh? (If needed)

If you want to start completely fresh:

```bash
# Delete .git folder
rm -rf .git

# Initialize new repo
git init
git add .
git commit -m "Initial commit - BookIt Backend API"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Need Help?

Just run these commands one by one and tell me if you get any errors.

