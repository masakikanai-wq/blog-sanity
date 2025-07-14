# Blog with Sanity CMS

A modern blog built with React, TypeScript, Tailwind CSS, and Sanity CMS.

## Features

- 📝 Content management with Sanity CMS
- 🎨 Modern, responsive design with Tailwind CSS
- ⚡ Fast development with Vite
- 🔧 TypeScript for type safety
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **CMS**: Sanity
- **Build Tool**: Vite
- **Deployment**: Vercel

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables with your Sanity project details.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-05-03
```

## Deployment

This project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the root directory to `web`
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build