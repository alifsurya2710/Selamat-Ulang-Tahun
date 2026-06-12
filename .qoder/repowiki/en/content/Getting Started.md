# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)
- [tsconfig.json](file://tsconfig.json)
- [app/layout.tsx](file://app/layout.tsx)
- [app/ClientLayout.tsx](file://app/ClientLayout.tsx)
- [app/context/AuthContext.tsx](file://app/context/AuthContext.tsx)
- [app/page.tsx](file://app/page.tsx)
- [app/login/page.tsx](file://app/login/page.tsx)
- [app/admin/page.tsx](file://app/admin/page.tsx)
- [app/components/BirthdayCard.tsx](file://app/components/BirthdayCard.tsx)
- [app/components/BirthdayMessage.tsx](file://app/components/BirthdayMessage.tsx)
- [app/components/PhotoGallery.tsx](file://app/components/PhotoGallery.tsx)
- [app/components/MusicPlayer.tsx](file://app/components/MusicPlayer.tsx)
- [app/globals.css](file://app/globals.css)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Initial Setup](#initial-setup)
5. [Development Environment](#development-environment)
6. [Local Server Startup](#local-server-startup)
7. [Basic Project Navigation](#basic-project-navigation)
8. [Accessing Pages](#accessing-pages)
9. [Understanding Basic Functionality](#understanding-basic-functionality)
10. [Troubleshooting](#troubleshooting)
11. [Verification Steps](#verification-steps)
12. [Conclusion](#conclusion)

## Introduction
Ulang Tahun Gebetan is a celebratory Next.js application designed to create an immersive birthday experience. It features role-based access (user and admin), animated components, interactive music playback, and dynamic content management. This guide helps you install, configure, and run the application locally so you can explore its functionality and customize content.

## Prerequisites
- Node.js: The project targets a modern runtime compatible with the specified dependencies. Ensure you have a recent LTS or current Node.js version installed.
- Package Manager: The project supports npm, yarn, pnpm, and bun. Choose whichever matches your workflow.
- Operating System: Windows, macOS, or Linux.
- Text Editor or IDE: Recommended for exploring TypeScript/React components and configuration files.

**Section sources**
- [package.json:11-27](file://package.json#L11-L27)
- [README.md:5-15](file://README.md#L5-L15)

## Installation
Follow these steps to install dependencies and prepare your environment:

1. Open your terminal or command prompt in the project root directory.
2. Install dependencies using your preferred package manager:
   - npm: `npm ci`
   - yarn: `yarn install`
   - pnpm: `pnpm install`
   - bun: `bun install`
3. Verify the installation completes without errors.

Notes:
- The project uses Next.js 16.2.9 and React 19.2.4. Using a compatible Node.js version ensures smooth operation.
- Tailwind CSS v4 and TypeScript are configured for styling and type safety.

**Section sources**
- [package.json:5-10](file://package.json#L5-L10)
- [package.json:11-27](file://package.json#L11-L27)
- [README.md:5-15](file://README.md#L5-L15)

## Initial Setup
Configure the development environment and project structure:

1. Review Next.js configuration:
   - The configuration file exists and is ready for optional customization.
2. Confirm TypeScript settings:
   - Strict mode is enabled, bundler module resolution is set, and path aliases are configured.
3. Verify Tailwind CSS integration:
   - Global styles are imported and animations/utilities are defined.

Key files to review:
- Next.js config: [next.config.ts](file://next.config.ts)
- TypeScript compiler options: [tsconfig.json](file://tsconfig.json)
- Global styles and animations: [app/globals.css](file://app/globals.css)

**Section sources**
- [next.config.ts:1-8](file://next.config.ts#L1-L8)
- [tsconfig.json:1-35](file://tsconfig.json#L1-L35)
- [app/globals.css:1-175](file://app/globals.css#L1-L175)

## Development Environment
- Language and Framework: TypeScript, React 19, Next.js App Router.
- Styling: Tailwind CSS v4 with custom animations and glass morphism utilities.
- Animation Library: Framer Motion for smooth transitions and micro-interactions.
- Additional Dependencies: react-confetti for confetti effects.

Environment highlights:
- Strict TypeScript compilation with incremental builds.
- Path alias @/* mapped to project root for clean imports.
- Global fonts (Geist) integrated via Next.js font optimization.

**Section sources**
- [package.json:11-27](file://package.json#L11-L27)
- [tsconfig.json:16-24](file://tsconfig.json#L16-L24)
- [app/layout.tsx:1-37](file://app/layout.tsx#L1-L37)
- [app/globals.css:1-175](file://app/globals.css#L1-L175)

## Local Server Startup
Start the development server using your chosen package manager:

- npm: `npm run dev`
- yarn: `yarn dev`
- pnpm: `pnpm dev`
- bun: `bun dev`

The server starts on http://localhost:3000. Open your browser to view the application.

Optional scripts:
- Build for production: `npm run build`
- Start production server: `npm run start`
- Run ESLint: `npm run lint`

**Section sources**
- [README.md:5-17](file://README.md#L5-L17)
- [package.json:5-10](file://package.json#L5-L10)

## Basic Project Navigation
Explore the application structure:

- Root Layout and Fonts:
  - Root layout defines metadata, fonts, and wraps children in ClientLayout.
- Client Layout:
  - Provides authentication context to all pages.
- Authentication Context:
  - Manages role state, login/logout, and admin password enforcement.
- Pages:
  - Home (/): Entry page with animated card, confetti, messages, gallery, and music player.
  - Login (/login): Role selection (user/admin) with admin password validation.
  - Admin (/admin): Content management for messages, photos, and page settings.

Navigation flow:
- Unauthenticated users are redirected to /login.
- Admin login requires the password "admin123".
- After login, users land on the home page; admins go to /admin.

**Section sources**
- [app/layout.tsx:1-37](file://app/layout.tsx#L1-L37)
- [app/ClientLayout.tsx:1-8](file://app/ClientLayout.tsx#L1-L8)
- [app/context/AuthContext.tsx:1-58](file://app/context/AuthContext.tsx#L1-L58)
- [app/page.tsx:1-239](file://app/page.tsx#L1-L239)
- [app/login/page.tsx:1-171](file://app/login/page.tsx#L1-L171)
- [app/admin/page.tsx:1-313](file://app/admin/page.tsx#L1-L313)

## Accessing Pages
- Home Page: http://localhost:3000/
  - Requires authentication; unauthenticated users are redirected to /login.
  - Features animated birthday card, confetti, rotating birthday messages, photo gallery, and music player.
- Login Page: http://localhost:3000/login
  - Select role (User/Admin).
  - Admin requires password "admin123".
- Admin Page: http://localhost:3000/admin
  - Manage messages, photos, and page settings.
  - Save changes to localStorage for persistence.

Behavior:
- Role state persists in localStorage.
- Admin password is validated client-side.

**Section sources**
- [app/page.tsx:13-44](file://app/page.tsx#L13-L44)
- [app/login/page.tsx:16-30](file://app/login/page.tsx#L16-L30)
- [app/admin/page.tsx:19-96](file://app/admin/page.tsx#L19-L96)
- [app/context/AuthContext.tsx:18-42](file://app/context/AuthContext.tsx#L18-L42)

## Understanding Basic Functionality
Core features and interactions:

- Authentication
  - Role-based routing and state management.
  - Admin password enforced during login.
- Home Page
  - Birthday card flip animation triggers confetti.
  - Rotating birthday messages cycle automatically.
  - Photo gallery displays customizable emoji and captions.
  - Music player toggles playback and shows progress.
- Admin Panel
  - Add/remove/edit messages and photos.
  - Customize page title/subtitle.
  - Save all changes to localStorage.

Component interactions:
- AuthContext provides role and login/logout to all pages.
- ClientLayout wraps pages with AuthProvider.
- Components use Framer Motion for animations and React Confetti for celebrations.

**Section sources**
- [app/context/AuthContext.tsx:18-42](file://app/context/AuthContext.tsx#L18-L42)
- [app/ClientLayout.tsx:3-7](file://app/ClientLayout.tsx#L3-L7)
- [app/components/BirthdayCard.tsx:10-159](file://app/components/BirthdayCard.tsx#L10-L159)
- [app/components/BirthdayMessage.tsx:14-98](file://app/components/BirthdayMessage.tsx#L14-L98)
- [app/components/PhotoGallery.tsx:28-100](file://app/components/PhotoGallery.tsx#L28-L100)
- [app/components/MusicPlayer.tsx:6-102](file://app/components/MusicPlayer.tsx#L6-L102)

## Troubleshooting
Common setup issues and resolutions:

- Port Already in Use
  - The development server runs on port 3000. If occupied, stop the conflicting process or change the port in your Next.js configuration.
- Missing Dependencies
  - Re-run your package manager install command to ensure all dependencies are present.
- TypeScript Errors
  - Enable strict mode as configured; resolve type mismatches reported by the TypeScript compiler.
- Tailwind CSS Not Applied
  - Ensure Tailwind is imported in global styles and PostCSS pipeline is configured.
- Admin Login Fails
  - Verify the admin password is "admin123".
- Music Not Playing
  - Confirm the audio file path "/birthday-song.mp3" exists in the public directory.

**Section sources**
- [README.md:17](file://README.md#L17)
- [app/login/page.tsx:19-24](file://app/login/page.tsx#L19-L24)
- [app/components/MusicPlayer.tsx:29-31](file://app/components/MusicPlayer.tsx#L29-L31)

## Verification Steps
Confirm successful installation and operation:

1. Start the development server using your package manager.
2. Visit http://localhost:3000:
   - Should redirect to /login if not authenticated.
3. Navigate to /login:
   - Select role (User/Admin).
   - Admin login requires password "admin123".
4. After login:
   - Home page loads with animated card and confetti on open.
   - Rotating birthday messages appear.
   - Photo gallery displays entries.
   - Music player controls playback.
5. Visit /admin:
   - Manage messages, photos, and page settings.
   - Save changes; verify persistence in localStorage.
6. Test logout:
   - Admin logout redirects to /login.

**Section sources**
- [README.md:5-17](file://README.md#L5-L17)
- [app/page.tsx:13-44](file://app/page.tsx#L13-L44)
- [app/login/page.tsx:16-30](file://app/login/page.tsx#L16-L30)
- [app/admin/page.tsx:63-70](file://app/admin/page.tsx#L63-L70)

## Conclusion
You are now ready to explore and customize the Ulang Tahun Gebetan application. Use the admin panel to tailor messages, photos, and page content, and leverage the animated components to create a delightful birthday experience. For further enhancements, extend the components, add assets, or integrate backend services as needed.