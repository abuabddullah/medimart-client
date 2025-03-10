# MediMart💊 - Your Online Medicine Shop

## Overview

MediMart হল একটি অনলাইন ফার্মেসি, যেখানে ব্যবহারকারীরা ঘরে বসেই ওষুধ খুঁজে পেতে, অর্ডার করতে ও ট্র্যাক করতে পারবেন। এতে রয়েছে সহজ ইউজার ইন্টারফেস, নিরাপদ পেমেন্ট সিস্টেম এবং একটি শক্তিশালী অর্ডার ম্যানেজমেন্ট ফিচার।

## Features

### 🔐 **User Authentication**

- ইমেইল/ফোন ও পাসওয়ার্ড ব্যবহার করে লগইন ও রেজিস্ট্রেশন।
- JWT ব্যবহার করে নিরাপদ অথেনটিকেশন।
- পাসওয়ার্ড হ্যাশিং (bcrypt) দ্বারা নিরাপত্তা নিশ্চিত।

### 👥 **User Roles**

- **Customers**: ওষুধ ব্রাউজ, কার্টে যোগ এবং অর্ডার করতে পারবেন।
- **Admin**: পণ্য ম্যানেজ, অর্ডার ম্যানেজ ও ইউজার কন্ট্রোল করতে পারবেন।

### 🏥 **Medicine Listings & Search**

- নাম, ক্যাটাগরি বা রোগের লক্ষণ অনুযায়ী সার্চ করা যাবে।
- প্রতিটি ওষুধের জন্য থাকবে:
  - নাম, বর্ণনা, মূল্য, স্টক, প্রস্তুতকারক, মেয়াদোত্তীর্ণ তারিখ
  - প্রেসক্রিপশন প্রয়োজন হলে আপলোড অপশন

### 🛒 **Shopping Cart & Checkout**

- কার্টে ওষুধ যোগ/পরিবর্তন করা যাবে।
- প্রেসক্রিপশন প্রয়োজন হলে আপলোড করতে হবে।
- পেমেন্ট ইন্টিগ্রেশন (SSLCOMMERZ)।

### 📦 **Order Management & Tracking**

- ব্যবহারকারীরা তাদের অর্ডার ট্র্যাক করতে পারবেন।
- অর্ডারের আপডেট ইমেইল নোটিফিকেশন পাবে।
- অ্যাডমিন অর্ডার আপডেট ও ম্যানেজ করতে পারবেন।

### 🛠 **Admin Dashboard**

- **Medicines Management**: নতুন ওষুধ যোগ, আপডেট ও ডিলিট।
- **Orders Management**: ইউজারদের অর্ডার অ্যাপ্রুভ/রিজেক্ট করা।
- **Users Management**: কাস্টমারদের তথ্য ও অর্ডার হিস্টোরি দেখা।

### 🔒 **Security & Compliance**

- প্রেসক্রিপশনভিত্তিক অর্ডার যাচাইয়ের ব্যবস্থা।
- রোল-বেইজড অ্যাক্সেস কন্ট্রোল (Admin vs Customer)।

## 🛠 **Tech Stack**

### **Frontend:**

- Next.js, TypeScript, React, Tailwind CSS

### **Backend:**

- Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, bcryptjs

## 🚀 **Project Setup & Run Locally**

### **Frontend Setup**

```bash
# Clone the frontend repository
git clone https://github.com/abuabddullah/medimart-client.git
cd medimart-client
npm install
npm run dev
```

### **Backend Setup**

```bash
# Clone the backend repository
git clone https://github.com/abuabddullah/medimart-server.git
cd medimart-server
npm install
npm run dev
```

### **Environment Variables (.env file)**

Project চালানোর জন্য `.env` ফাইলে প্রয়োজনীয় কনফিগারেশন সেট করতে হবে।

## 🔗 **Live Links**

- **Frontend:** [MediMart Client](https://medimart-client.vercel.app/)
- **Backend:** [MediMart Server](https://medimert-server.vercel.app/)

## 🎟 **Admin Credentials**

- **Email:** admin@admin.admin
- **Password:** 000000

## 🎥 **Demo Video**

- [Project Walkthrough](https://drive.google.com/file/d/1hIcAWxrOSbjFWekaytiDMShW8sElt0Us/view?usp=sharing)

---

### Regards

Asif A Owadud

## issue i recommend to fix

- যাতে promptly ui এ দেখা যায়
- পরে আরো improve করতে হবে
- pdf handle সরাতে হবে
- using Moment.js for formattedDate
- /shop page এ pagination / infinite scroll
- create and update medicine এ picture upload option
- fix the quantity handle fn in src\app\medicine\[id]\page.tsx
