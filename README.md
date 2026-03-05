# KOL – Company Collaboration Platform

A full-featured **frontend marketplace platform** that enables **Key Opinion Leaders (Influencers)** to collaborate with **Companies (Brands)** for marketing campaigns.

The platform provides role-based dashboards, campaign management, collaboration workflows, chat negotiation, and wallet management.

---

# Project Overview

This project simulates a **two-sided collaboration marketplace**, where:

* **Companies** create marketing campaigns.
* **Influencers (KOLs)** collaborate with brands to promote campaigns.
* **Admins** verify influencer social accounts to ensure authenticity.

The application focuses on **clean frontend architecture**, **role-based routing**, and **realistic product workflows** similar to modern SaaS platforms.

---

# Key Features

## Role-Based Authentication

The system supports **three user roles**:

### KOL (Influencer)

Influencers can:

* Create and manage their profile
* Connect social media accounts
* Receive and manage collaboration requests
* Negotiate campaign offers via chat
* Track earnings through a wallet system

### Company (Brand)

Companies can:

* Create and manage campaigns
* Browse available influencers
* Send collaboration proposals
* Manage ongoing campaigns
* Handle campaign payments through the wallet

### Admin

Admins can:

* Review influencer social accounts
* Approve or reject verification requests

---

# Platform Modules

## Authentication System

Features:

* Role-based login and registration
* Protected routes
* Automatic role-based redirection
* Secure authentication flow

Example redirect behavior:

| Role    | Redirect             |
| ------- | -------------------- |
| KOL     | `/kol/dashboard`     |
| Company | `/company/dashboard` |
| Admin   | `/admin/dashboard`   |

---

# KOL Dashboard

Influencers have access to a dedicated dashboard that includes:

### Dashboard Overview

Displays:

* Total collaborations
* Pending requests
* Revenue earned
* Active campaigns
* Performance statistics

### Profile Management

Influencers can manage:

* Profile picture
* Bio
* Niche
* Location
* Audience demographics
* Portfolio
* Media kit

Includes **editable and preview modes**.

---

# Social Media Account Integration

Influencers can connect social media accounts such as:

* Instagram
* YouTube
* TikTok
* X (Twitter)

Each account displays:

* Followers
* Engagement rate
* Average likes
* Average views

Accounts must be **verified by Admin** before receiving the verification badge.

---

# Collaboration System

Influencers can manage collaboration requests in different tabs:

* Incoming requests
* Active collaborations
* Completed collaborations
* Rejected collaborations

Each collaboration card shows:

* Company name
* Campaign title
* Budget
* Timeline
* Status

Available actions:

* Accept
* Reject
* Negotiate

---

# Real-Time Chat & Negotiation

The platform includes a **negotiation chat system** where companies and influencers can discuss campaign details.

Features include:

* Messaging between company and influencer
* Offer negotiation
* Final offer confirmation
* Budget agreement

This simulates a real campaign negotiation workflow.

---

# Wallet System

The wallet system allows users to track financial activity.

### KOL Wallet

Shows:

* Available balance
* Pending balance
* Total earnings
* Withdrawal option
* Transaction history

### Company Wallet

Displays:

* Total funds added
* Current balance
* Funds allocated to campaigns
* Transaction history

---

# Company Dashboard

Companies have their own dashboard with tools to manage campaigns and influencer collaborations.

### Campaign Creation

Companies can create campaigns with:

* Campaign title
* Description
* Deliverables
* Budget range
* Deadline
* Target audience
* Platform requirements
* Country targeting

---

# Browse Influencers

Companies can search for influencers using filters:

* Platform
* Country
* Category
* Engagement rate
* Followers
* Rating
* Budget

Each influencer card displays:

* Followers
* Engagement rate
* Estimated price
* Rating
* Proposal button

Includes **search filtering and pagination**.

---

# Campaign Management

Companies can track campaign progress including:

* Total budget
* Invited influencers
* Approved influencers
* Deliverables progress

Actions include:

* Send invite
* Approve influencer
* Track deliverables
* Release payments

---

# Admin Panel

Admins manage verification requests for influencer social accounts.

Admin features include:

* View pending verification requests
* Approve social accounts
* Reject accounts if necessary

Once approved, the influencer receives a **verification badge**.

---

# UI & UX Features

The application includes several reusable UI components:

* Role-based sidebar navigation
* Dashboard layout
* Notification system
* Modal dialogs
* Pagination
* Search filters
* Toast notifications
* Error handling screens
* Responsive layouts

---

# Technical Stack

Frontend Technologies Used:

* React
* React Router
* Tailwind CSS
* React Icons
* React Hot Toast

The project focuses on **component-based architecture and scalable frontend design**.

---

# Project Folder Structure

```
kol-company-collaboration-platform

kol-platform-frontend
│
├── src
│   ├── components
│   ├── layouts
│   ├── pages
│   │   ├── admin
│   │   ├── kol
│   │   ├── company
│   │   ├── auth
│   │   └── common
│   ├── routes
│   ├── store
│   ├── utils
│   └── App.jsx
│
├── public
├── package.json
└── README.md
```

---

# Installation & Setup

Clone the repository:

```
git clone https://github.com/yourusername/kol-company-collaboration-platform.git
```

Navigate to the project folder:

```
cd kol-platform-frontend
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

The application will run at:

```
http://localhost:5173
```
