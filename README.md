# Dressify – Fashion Simplified

> A comprehensive guide to the Dressify project: digitize, organize, and enhance your wardrobe with AI-powered recommendations.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Motivation & Vision](#motivation--vision)
3. [Key Features](#key-features)

   1. [Wardrobe Management](#wardrobe-management)
   2. [AI Recommendation Engine](#ai-recommendation-engine)
   3. [User Interface & Experience](#user-interface--experience)
   4. [Authentication & Security](#authentication--security)
   5. [Analytics & Reporting](#analytics--reporting)
4. [Architecture & Design](#architecture--design)

   1. [System Architecture Diagram](#system-architecture-diagram)
   2. [Component Breakdown](#component-breakdown)
   3. [Data Flow](#data-flow)
5. [Getting Started](#getting-started)

   1. [Prerequisites](#prerequisites)
   2. [Installation](#installation)
   3. [Configuration](#configuration)
   4. [Running Locally](#running-locally)
6. [Detailed Usage Guide](#detailed-usage-guide)

   1. [Initial Onboarding](#initial-onboarding)
   2. [Uploading Items](#uploading-items)
   3. [Categorization & Tagging](#categorization--tagging)
   4. [Dashboard & Filters](#dashboard--filters)
   5. [Outfit Generation](#outfit-generation)
7. [API Endpoints](#api-endpoints)

   1. [Auth Routes](#auth-routes)
   2. [Wardrobe Routes](#wardrobe-routes)
   3. [Recommendation Routes](#recommendation-routes)
8. [Database Schema](#database-schema)

   1. [Users Table](#users-table)
   2. [Items Table](#items-table)
   3. [Categories Table](#categories-table)
   4. [Recommendations Table](#recommendations-table)
9. [AI & Model Details](#ai--model-details)

   1. [Computer Vision Pipeline](#computer-vision-pipeline)
   2. [Embedding Generation](#embedding-generation)
   3. [Outfit Scoring Algorithm](#outfit-scoring-algorithm)
10. [Testing & QA](#testing--qa)

    1. [Unit Tests](#unit-tests)
    2. [Integration Tests](#integration-tests)
    3. [E2E Tests](#e2e-tests)
11. [CI/CD Pipeline](#cicd-pipeline)

    1. [Workflow Definition](#workflow-definition)
    2. [Deployment Strategies](#deployment-strategies)
12. [Performance & Optimization](#performance--optimization)

    1. [Caching Strategies](#caching-strategies)
    2. [Load Balancing](#load-balancing)
13. [Security Considerations](#security-considerations)

    1. [Authentication Flow](#authentication-flow)
    2. [Data Encryption](#data-encryption)
14. [Developer Guidelines](#developer-guidelines)

    1. [Coding Standards](#coding-standards)
    2. [Branching Strategy](#branching-strategy)
    3. [Pull Request Process](#pull-request-process)
15. [Contributing](#contributing)
16. [Roadmap & Future Work](#roadmap--future-work)
17. [FAQ](#faq)
18. [Troubleshooting](#troubleshooting)
19. [Acknowledgments](#acknowledgments)
20. [License](#license)

---

## Project Overview

Dressify is an end-to-end platform designed to revolutionize the way users manage and leverage their wardrobe. By combining a digital closet manager with an AI-driven recommendation engine, Dressify offers:

* **Comprehensive Item Management:** Upload, edit, and categorize clothing items with ease.
* **Intelligent Outfit Suggestions:** Personalized outfit combinations based on user preferences, weather data, and event context.
* **Seamless UX:** A responsive, accessible interface built with Next.js and Tailwind CSS.

*(...additional paragraphs and sub-sections expanding every bullet above in exhaustive detail...)*

---

## Motivation & Vision

In modern life, choosing what to wear is often stressful and time-consuming. Dressify seeks to:

1. Reduce decision fatigue by presenting curated outfit options.
2. Encourage sustainable consumption by promoting existing wardrobe usage.
3. Empower users with data-driven insights into their style habits.

*(...extend with 10+ paragraphs on research, user surveys, inspiration stories, and future vision...)*

---

## Key Features

### Wardrobe Management

* **Bulk Upload & Metadata Extraction:** Support for drag-and-drop multi-file upload, automatic EXIF metadata retrieval, and manual metadata editing.
* **Advanced Filtering:** Filter items by color, season, fabric type, and custom tags.
* **Tag Suggestions:** Machine learning-powered tag recommendations that learn from user corrections.

*(...and so on detailing every sub-feature with implementation notes, UI screenshots references, code snippets, tips...)*

### AI Recommendation Engine

* **Computer Vision Models:** Utilizes a hybrid ensemble of ResNet50 and Vision Transformer (ViT) for robust item classification.
* **Style Embedding:** Text and image embeddings fused with triplet loss training to capture style similarity.
* **Dynamic Scoring:** Outfits scored on compatibility, diversity, and weather-appropriateness.

*(...deep dive into architecture diagrams, mathematical formulations, hyperparameters used, training dataset descriptions...)*

### User Interface & Experience

* **Responsive Design:** Tailwind CSS-based breakpoints for mobile, tablet, and desktop.
* **Progressive Enhancement:** Skeleton loaders, lazy-loaded images, and service workers for offline access.
* **Accessibility:** ARIA labels, keyboard navigation support, and WAI-ARIA compliance.

*(...complete with code snippets, HTML structures, ARIA attribute lists, contrast ratio details...)*

### Authentication & Security

* **Supabase Auth:** Email/password, OAuth with Google, GitHub, and Magic Link support.
* **Role-Based Access:** Admin, stylist, and end-user roles with granular ACLs.
* **Encryption:** AES-256 encryption for sensitive data, SSL/TLS for data in transit.

*(...dive into JWT token structure, refresh token policy, key rotation strategy...)*

### Analytics & Reporting

* **User Insights Dashboard:** Charts for wear frequency, category distribution, and engagement metrics.
* **Exportable Reports:** CSV and PDF exports of wardrobe stats and recommendation history.

*(...include sample chart descriptions, data schema for analytics, export code examples...)*

---

## Architecture & Design

### System Architecture Diagram

![System Architecture](./docs/system-architecture.png)

### Component Breakdown

1. **Frontend (Next.js)**
2. **Backend API (Node.js + FastAPI)**
3. **AI Microservices (Python, TensorFlow, PyTorch)**
4. **Database (PostgreSQL via Supabase)**
5. **Storage (Supabase Storage / AWS S3)**

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant A as API Server
    participant D as Database
    participant AI as AI Service
    U->>F: Login Request
    F->>A: POST /auth/login
    A->>D: Verify Credentials
    D-->>A: JWT Token
    A-->>F: Return JWT
    U->>F: Upload Item
    F->>A: POST /items
    A->>AI: send image for classification
    AI-->>A: Category & Tags
    A->>D: Save Item & Metadata
    D-->>A: Success
    A-->>F: Display New Item


## Getting Started

### Prerequisites

* Node.js ≥ 18.x
* npm ≥ 8.x or yarn ≥ 1.22.x
* Python ≥ 3.9 for AI services
* Docker & Docker Compose (optional but recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/Ali-Ch-001/dessify-project-code.git
cd dessify-project-code

# Install frontend dependencies
cd app
npm install

# Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt
```

### Configuration

1. Copy `.env.example` to `.env.local` in `app/` and `ai-service/`
2. Populate variables:

   ```ini
   # Frontend (.env.local)
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   AI_SERVICE_URL=http://localhost:8000/predict

   # AI Service (.env.local)
   MODEL_PATH=./models/ensemble_model.pth
   LOG_LEVEL=DEBUG
   ```

### Running Locally

```bash
# Start Supabase Emulation (if using)
supabase start

# Start AI Service
cd ai-service
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start Frontend
cd ../app
npm run dev
```

---

## Detailed Usage Guide

### Initial Onboarding

1. **Sign Up / Log In**: Create an account or authenticate via OAuth.
2. **Profile Setup**: Add personal details (height, style preferences, favorite colors) to personalize recommendations.

### Uploading Items

* **Drag & Drop**: Drop multiple high-resolution images simultaneously.
* **Webcam Capture**: Capture live images with integrated camera component.
* **Batch Metadata Editing**: Bulk assign category, season, and custom tags via modal interface.

*(...include screenshot links, accessibility notes, performance tips...)*

### Categorization & Tagging

1. **Automatic Detection**: AI model suggests labels.
2. **Manual Override**: Edit category, add or remove tags.
3. **Tag Learning**: Corrected tags feed back into model for improved accuracy.

### Dashboard & Filters

* **Grid View vs. List View**: Toggle display modes.
* **Filter Panel**: Multi-select filters for color, fabric, weather, event.
* **Search Bar**: Full-text search on item names and tags.

### Outfit Generation

1. **Select Occasion**: e.g., Business, Casual, Formal.
2. **Specify Weather**: Auto-detected via geolocation or manual input.
3. **Adjust Style Weights**: Prioritize comfort, trendiness, or color coordination.
4. **Generate & Save**: Browse generated outfits, save favorites to collections.