# Dressify – Fashion Simplified

> A modern wardrobe management and AI-powered outfit recommendation platform that helps you digitize, organize, and elevate your personal style.

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
   - [Completed Tasks](#completed-tasks)  
   - [In Progress](#in-progress)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running Locally](#running-locally)  
5. [Usage](#usage)  
6. [Project Structure](#project-structure)  
7. [Roadmap & Future Aspirations](#roadmap--future-aspirations)  
8. [Why Dressify?](#why-dressify)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Acknowledgments](#acknowledgments)  

---

## Project Overview

Dressify is designed to transform your physical closet into a powerful digital wardrobe. By combining intuitive management tools with advanced AI, it helps you:  
- **Organize** your clothing items  
- **Automatically categorize** them via computer vision  
- **Receive outfit recommendations** tailored to your existing collection  

The result? Faster morning routines, smarter shopping decisions, and a clearer personal style.

---

## Features

### Completed Tasks

- **Responsive Landing Page**  
  - Built in `app/page.tsx` (lines 22–148)  
  - Animated hero sections and feature highlights with Framer Motion  
- **Authentication System**  
  - Supabase-powered sign up, login, and account management (`app/page.tsx`:29–35)  
- **Modern UI Framework**  
  - Next.js 15, React 19, Tailwind CSS (`package.json`:23–31)  
- **Upload & Capture Wardrobe Items**  
  - Drag & drop or file browser upload (`app/page.tsx`:38–46)  
  - Live webcam capture integration (`app/page.tsx`:93–105)  
- **Automatic Categorization**  
  - AI-driven detection & tagging of clothing items (`app/page.tsx`:49–69)  
- **Digital Closet Dashboard**  
  - Interactive item grid with filters and search (`app/page.tsx`:85–165)  
- **Category Reclassification**  
  - Manual override of AI assignments (`app/page.tsx`:66–78)  

### In Progress

- **AI Integration Improvements**  
  - Enhance model accuracy for sub-categories (e.g., “denim jackets” vs “leather jackets”)  
  - Expand taxonomy with seasonal and style-based labels (`app/page.tsx`:18–23)  
- **UX & Animation Enhancements**  
  - Smoother transitions, micro-interactions, and skeleton loaders (`app/page.tsx`:114–122)  
  - Adaptive layouts for tablets and large screens  
- **Backend Infrastructure**  
  - Robust Supabase schemas for performance at scale (`app/lib/supabaseClient.ts`)  
  - Optimized image storage and CDN integration  

---

## Tech Stack

- **Framework**: Next.js 15 + React 19  
- **Styling**: Tailwind CSS  
- **Animations**: Framer Motion  
- **Backend & Auth**: Supabase (PostgreSQL, Auth)  
- **AI Services**: Custom computer-vision microservice for item categorization  
- **Deployment**: Vercel (frontend), Supabase Edge Functions  

---

## Getting Started

### Prerequisites

- [Node.js ≥ 18.x](https://nodejs.org/)  
- [npm or yarn](https://classic.yarnpkg.com/)  
- Supabase project with API keys

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Ali-Ch-001/dessify-project-code.git
   cd dessify-project-code
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env.local` in the root directory and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AI_SERVICE_ENDPOINT=https://your-ai-service.com/predict
```

### Running Locally

* **Development**

  ```bash
  npm run dev
  ```

* **Production Preview**

  ```bash
  npm run build
  npm run start
  ```

---

## Usage

1. **Sign Up / Log In** via the top-right button on the landing page.
2. **Add Wardrobe Items** by clicking “Upload” or using your webcam.
3. **Review & Confirm** AI-detected categories; edit if necessary.
4. **Browse Your Digital Closet**:
   * Filter by category, season, or color
   * Search by keyword
5. **Get Outfit Suggestions** (coming soon):
   * Personalized combos based on your existing items
   * Occasion and weather-aware recommendations

---

## Project Structure

```
├── app/
│   ├── page.tsx                # Landing page + core feature UI
│   └── dashboard/              # Protected user dashboard
│       └── wardrobe/           # Closet management components
├── components/
│   ├── InfoSection.tsx         # About & roadmap section
│   └── ...                     # Reusable cards, modals, etc.
├── lib/
│   └── supabaseClient.ts       # Supabase initialization
├── public/                     # Static assets (logos, icons)
├── styles/                     # Global Tailwind overrides
├── package.json
├── tsconfig.json
└── README.md
```

---

## Roadmap & Future Aspirations

1. **AI-Powered Fashion Recommendations**

   * Dynamic outfit generation (`components/InfoSection.tsx`:72–85)
   * Seasonal and event-based styling
2. **Shopping Integration**

   * In-app store partnerships (`components/InfoSection.tsx`:106–119)
   * Wishlist & “Buy the Look” features
3. **Advanced Analytics**

   * Wear-frequency tracking
   * Sustainability metrics & style evolution insights
4. **Social Features**

   * Shareable outfit boards
   * Community style challenges

---

## Why Dressify?

### The Fashion Challenge

Deciding what to wear often wastes precious time and mental energy. Clothes languish unused when we can’t visualize new combinations.

### Our Solution

* **Digital Closet**: Instantly access your entire wardrobe
* **AI Insights**: Let intelligent models suggest cohesive outfits
* **Intentional Shopping**: Discover pieces that complement what you already own

Dressify transforms your wardrobe into a source of confidence and creativity.

---

## Contributing

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m "feat: add ..."`) 
4. **Push** to your fork (`git push origin feature/your-feature`)
5. Open a **Pull Request** for review

Please follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

* Built with ❤️ using [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Supabase](https://supabase.com/)
* Inspired by the need for sustainable, stress-free personal styling
* Special thanks to all early testers and feedback providers