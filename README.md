# 🚢 Wharf

A modern, beautiful Docker Registry UI for managing and exploring your container registries.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## ✨ Features

- **Multi-Registry Support** - Connect to multiple Docker registries simultaneously
- **Auto-load Registry** - Configure registry URL in environment variables for automatic connection
- **Beautiful UI** - Modern, responsive design with smooth animations
- **Tag Management** - View, explore, and delete container tags
- **Manifest Inspector** - Examine image manifests and layer details
- **Dark Mode** - Built-in theme switching for comfortable viewing
- **Real-time Stats** - Track registries, repositories, and tags at a glance

## 🚀 Quick Start

Install dependencies:

```bash
pnpm install
```

**Optional:** Auto-load a registry on startup by creating a `.env.local` file:

```env
NEXT_PUBLIC_REGISTRY_URL=https://registry.example.com
NEXT_PUBLIC_REGISTRY_USERNAME=admin
NEXT_PUBLIC_REGISTRY_PASSWORD=password123
```

> **Note:** Replace the dummy values above with your actual Docker registry URL and credentials.

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start exploring your registries.

## 📦 Build for Production

```bash
pnpm build
pnpm start
```

## 🐳 Docker

Build and run with Docker:

```bash
docker build -t wharf .
docker run -p 3000:3000 wharf
```

## 🎯 Usage

1. **Add a Registry** - Enter your Docker registry URL and credentials
2. **Connect** - Establish connection to your registries
3. **Explore** - Browse repositories, tags, and inspect manifests
4. **Manage** - Delete tags or entire repositories as needed

## 🛠️ Tech Stack

- **Framework** - Next.js 15 with App Router
- **UI Library** - React 19 with Tailwind CSS
- **Components** - Radix UI primitives
- **Animations** - Motion (Framer Motion)
- **Forms** - React Hook Form + Zod validation
- **Theme** - next-themes for dark/light mode

## 📝 License

MIT

---

Built with ❤️ for Docker enthusiasts
