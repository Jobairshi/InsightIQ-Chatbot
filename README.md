````markdown
# IntelliFAQ Frontend

> **A modern Next.js frontend for IntelliFAQ – AI-powered FAQ search, chat, lesson generation, and MCQ creation.**  
> Built with **Next.js 14** + **TailwindCSS** and seamlessly integrated with the IntelliFAQ FastAPI backend.

---

## 🌐 Overview

The **IntelliFAQ Frontend** provides a sleek, responsive interface to interact with the **IntelliFAQ API**.  
With this application, users can:  
- Perform **semantic FAQ searches**  
- Chat with an **AI assistant** that understands your knowledge base  
- Generate **course lessons** on any topic with customizable difficulty  
- Create **multiple-choice questions (MCQs)** instantly  

This frontend makes accessing the API **simple, user-friendly, and visually engaging**.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)  
- **Styling:** [TailwindCSS](https://tailwindcss.com/)  
- **HTTP Client:** [Axios](https://axios-http.com/)  
- **State Management:** React hooks & Context API  
- **Deployment Ready:** Easily host on Vercel or any Next.js-compatible platform  

---

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/intellifaq-frontend.git
   cd intellifaq-frontend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set environment variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in your browser**
   [http://localhost:3000](http://localhost:3000)

---

## 🔧 Troubleshooting

* **CORS Issues:** Ensure the backend (`IntelliFAQ API`) has proper CORS settings for your frontend domain.
* **API Unreachable:** Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local` is pointing to the correct backend server.
* **Build Errors:** Clear `.next` and reinstall dependencies:

  ```bash
  rm -rf .next node_modules && npm install
  ```

---

## 🚀 Deployment

For production, build and export:

```bash
npm run build
npm start
```

**Deploy easily on:** [Vercel](https://vercel.com), [Netlify](https://www.netlify.com/), or any Node.js hosting service.
