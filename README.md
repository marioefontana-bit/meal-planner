# Meal Planner Application

A comprehensive weekly meal planning application built with React, TypeScript, and Tailwind CSS.

## Features

- **Weekly Scheduler**: Plan 2 meals per day (lunch and dinner) for the entire week.
- **Leftovers Logic**: Easily mark lunch slots as leftover-friendly.
- **Shopping List**: Automatically generate shopping lists based on your meal plan and configurable frequency.
- **Dark Mode**: Sleek, professional dark-mode interface.
- **Responsive Design**: Works on desktop and tablet.

## How to Run

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- A terminal/command prompt (PowerShell, Command Prompt, or Git Bash)

### Installation & Startup

1.  **Open your Terminal**
    Navigate to the project directory:
    ```bash
    cd C:\Users\mario\Documents\Projectos\Comida
    ```

2.  **Install Dependencies**
    This command downloads all the necessary libraries (React, Tailwind, icons, etc.) listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Start Development Server**
    This command runs the app locally.
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Look for the "Local" URL in the terminal output (usually `http://localhost:5173`) and open it in your web browser.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate the static files in the `dist` folder, which can be deployed to any web host.
