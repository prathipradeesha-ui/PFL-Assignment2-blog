
# ProjectHub – Next.js Blog

## Overview
ProjectHub is a blog application for Software Engineering students to share their final-year project ideas and descriptions.

## Framework
- Next.js
- React
- TypeScript
- Tailwind CSS

## Features
- View project posts
- Create new posts
- View individual post details
- Edit and delete user-created posts
- Search posts by title, author, or description
- Filter posts by tag
- Store user-created posts in browser localStorage

## Testing
Automated unit tests are implemented for the search and tag-filtering function using Vitest.

Run the tests:

```bash
npm run test -- --run
```

Run lint:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

## Storage limitation
This version uses browser localStorage to simulate persistence. It does not currently use a separate database or backend API.

## Run locally
Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address shown in the terminal.