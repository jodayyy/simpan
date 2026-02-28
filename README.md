# Simpan

A web application to manage monthly financial commitments and savings goals.

## Overview

Simpan helps users track their monthly financial obligations and monitor progress toward savings goals. The application provides a clean dashboard view with detailed management pages for both commitments and savings.

## Features

### Authentication & Profile
- Email/password authentication with Firebase
- User profile with editable username and monthly salary
- Password change functionality

### Monthly Commitments
- Track recurring monthly expenses (rent, utilities, subscriptions, etc.)
- Mark payments as paid/unpaid
- Automatic monthly reset on the 1st
- Categorize with predefined categories

### Savings Goals
- Set target-based savings goals
- Track progress with visual indicators
- Add contributions over time
- Mark goals as completed when target is reached

### Dashboard
- Overview of recent commitments and savings goals
- Shows up to 5 unpaid-first commitments and top savings goals by progress

## Application Structure

**Pages:**
1. Dashboard - Summary view of all data
2. Commitments - Manage monthly expenses
3. Savings - Manage savings goals
4. Profile - Edit username and password

**Navigation:**
- Desktop: Collapsible sidebar with top bar
- Mobile: Bottom navigation bar

## Data Models

**User Profile:**
- Email, Username, Monthly take-home salary, Created/Updated timestamps

**Commitment:**
- Name, Amount, Category, Payment status, User ID

**Savings Goal:**
- Name, Target amount, Current amount, Completion status, User ID

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4 + shadcn/ui (Radix UI)
- React Router 7
- Zustand 5
- Framer Motion (page transitions)
- React Hook Form + Zod

**Backend:**
- Firebase 12 (Authentication + Firestore)

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Installation

```bash
npm install
npm run dev
```

The application will open at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
