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
  "name": "my-v0-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-context-menu": "^2.2.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-hover-card": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-navigation-menu": "^1.2.3",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "latest",
    "embla-carousel-react": "8.5.1",
    "input-otp": "1.4.1",
    "lucide-react": "^0.454.0",
    "next": "14.2.16",
    "next-themes": "latest",
    "react": "^18",
    "react-day-picker": "latest",
    "react-dom": "^18",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "latest",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.6",
    "zod": "^3.24.1",
    "mongoose": "latest",
    "bcryptjs": "latest",
    "jspdf": "latest",
    "jspdf-autotable": "latest"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
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