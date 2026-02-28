# 2026-S-GROUP3-BatchGrade

> A desktop grading application built with Electron, React, and TypeScript.

![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

---

BatchGrade is a solution to grading that can be hosted on infrastructure already owned by the university (such as the Bellagio server for CSN) or run locally on the instructor or student's computer.

## Table of Contents

- [Recommended IDE Setup](#recommended-ide-setup)
- [Project Setup](#project-setup)
- [Scripts & Commands](#scripts--commands)
- [Tech Stack Documentation](#tech-stack-documentation)

---

## Recommended IDE Setup

![VSCode](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

[VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## Project Setup

### Install

```bash
npm install
```

### Development

Starts the app in development mode with hot-reloading.

```bash
npm run dev
```

### Build

Compiles and packages the app for your target platform.

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

---

### Requirements

- Recommended Node.js: >= 22
- Tested with Node.js: 24.14.0 (maintainer environment)

If you encounter native build issues (for example with `better-sqlite3` or other native modules), switch to a Node.js version compatible with the Electron binary in `devDependencies` or rebuild native modules after switching versions.

### Where build files and executables are placed

- `dist/` — Top-level folder where `electron-builder` writes packaged artifacts.
- `dist/<platform>-unpacked/` — Platform-specific unpacked build folder (examples below):
 	- `dist/linux-unpacked/` — contains unpacked Linux app files and the executable for Linux.
 	- `dist/win-unpacked/` — contains unpacked Windows app files and the `.exe`.
 	- `dist/mac` or `dist/mac-unpacked/` — contains the macOS `.app` bundle.
- Packaged installers and distributables (for example `.AppImage`, `.deb`, `.dmg`, `.exe`) are placed in `dist/` after a packaging build.

Examples:

- After `npm run build:linux` you will commonly see an unpacked app at `dist/linux-unpacked/`, and one or more packaged artifacts (for example `BatchGrade-1.0.0.AppImage`) in `dist/`.
- The executable inside the unpacked folder is named after the application (package name: `batchgrade`).

Use `npm run clean` to remove `dist/`, `out/`, and `node_modules/`.

---

## Scripts & Commands

### Drizzle

BatchGrade uses [Drizzle ORM](https://orm.drizzle.team/) with a local SQLite database.

**Studio:** Opens Drizzle Studio, a visual browser for your local database.

```bash
npm run studio
```

**Generate:** Generates SQL migration files from your schema changes.

```bash
npm run generate
```

**Migrate:** Applies pending migrations to the database.

```bash
npm run migrate
```

## Tech Stack Documentation

This document lists the project's primary technologies with links to their official documentation.

- Electron-Vite: <https://electron-vite.org/>
- Electron: <https://www.electronjs.org/>
- Vite: <https://vitejs.dev/>
- React: <https://reactjs.org/>
- TypeScript: <https://www.typescriptlang.org/>
- Tailwind CSS: <https://tailwindcss.com/>
- Drizzle (ORM): <https://orm.drizzle.team/>
- SQLite: <https://www.sqlite.org/>
- ESLint: <https://eslint.org/>
- Prettier: <https://prettier.io/>
