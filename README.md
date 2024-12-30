# Calendar Application

A feature-rich calendar application built with Next.js, Tailwind CSS, and MongoDB. This guide will help you set up, install dependencies, run, and deploy the application.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Install Dependencies](#install-dependencies)
- [Run the Application Locally](#run-the-application-locally)
- [Deployment](#deployment)
  - [Deploying on Vercel](#deploying-on-vercel)
  - [Deploying on Netlify](#deploying-on-netlify)

---

## Setup Instructions

1. Open **Visual Studio Code (VS Code)**.
2. Create a new folder for the project and open it in VS Code.
3. Open the terminal in VS Code:  
   **View > Terminal**.

4. Initialize a new project using:

   ```bash
   npx create-next-app@latest calendar


   Follow the prompts:
   - Use TypeScript: `Yes`
   - Use ESLint: `Yes`
   - Use Tailwind CSS: `Yes`
   - Use `src/` directory: `No`
   - Use App Router: `Yes`
   - Customize import alias: `No`

5. Navigate to the project directory:

   ```bash
   cd calendar
   ```

---

## Install Dependencies

1. Install the required packages:

   ```bash
   npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs class-variance-authority clsx date-fns lucide-react mongoose recharts tailwind-merge tailwindcss-animate bcryptjs
   ```

2. Install development dependencies:

   ```bash
   npm install --save-dev @types/bcryptjs ts-node
   ```

---

## Set Up MongoDB Connection

1. Create a `.env.local` file in the root directory.
2. Add the following line with your MongoDB URI:

   ```env
   MONGODB_URI=mongodb+srv://w=majority&appName=Cluster0
   ```

---

## Create Project Structure

1. Inside the `app` folder, create the following directories:
   - `components`
   - `context`
   - `lib`
   - `models`
   - `api`

2. Add your necessary files in these folders, such as `AppContext.tsx`, `LoginPage.tsx`, and `SignUpPage.tsx`.

---

## Update `package.json`

Replace the content of `package.json` with the following:

```json
{
  "name": "calendar",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "create-admin": "ts-node scripts/createAdminUser.ts"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-popover": "^1.0.6",
    "@radix-ui/react-select": "^1.2.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.6.0",
    "clsx": "^1.2.1",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.244.0",
    "mongoose": "^7.3.1",
    "next": "13.4.7",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "recharts": "^2.7.2",
    "tailwind-merge": "^1.13.2",
    "tailwindcss-animate": "^1.0.6"
  },
  "devDependencies": {
    "@types/node": "20.3.1",
    "@types/react": "18.2.14",
    "@types/react-dom": "18.2.6",
    "@types/bcryptjs": "^2.4.2",
    "autoprefixer": "10.4.14",
    "eslint": "8.43.0",
    "eslint-config-next": "13.4.7",
    "postcss": "8.4.24",
    "tailwindcss": "3.3.2",
    "typescript": "5.1.3",
    "ts-node": "^10.9.1"
  }
}
```

---

## Run the Application Locally

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open the application in your browser at [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Deploying on Vercel

1. Log in to [Vercel](https://vercel.com/) and link your GitHub account.
2. Import your repository.
3. Click "Deploy" and wait for the build process to complete.

### Deploying on Netlify

1. Log in to [Netlify](https://www.netlify.com/) and link your GitHub account.
2. Import your repository.
3. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
4. Click "Deploy Site."

---

### Notes

- Ensure that `.env.local` is added to your `.gitignore` to avoid exposing sensitive credentials.
- Always test the deployment to verify that the application works as expected.

Happy coding!
```