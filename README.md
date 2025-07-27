# QuantCalender

QuantCalender is a modern, full-stack web application for tracking, visualizing, and analyzing market and calendar data. It features authentication, real-time market data, customizable dashboards, and a robust settings system.

## Features

- **User Authentication**: Secure JWT-based login, refresh, and sign-out flows.
- **Calendar Integration**: Visualize and filter events with a heatmap and custom views.
- **Market Dashboard**: Real-time price widgets, order book, and performance charts.
- **Settings**: Manage account, API, data, notifications, security, and theme preferences.
- **Responsive UI**: Built with React, Next.js, and Tailwind CSS for a seamless experience across devices.
- **WebSocket Support**: Live market data streaming.
- **Extensible**: Modular architecture for easy feature addition.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (if using the database features)
- [Optional] Neon database for cloud development

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/quantCalender.git
   cd quantCalender
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following (adjust as needed):

   ```
   JWT_SECRET=your-very-long-random-secret-key
   DATABASE_URL=your-database-url
   ```

   - `JWT_SECRET` must be at least 32 characters long.

4. **Set up the database:**
   - To reset and seed the database, use the provided scripts:
     ```bash
     npm run db:reset
     npm run db:seed
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/                # Next.js app directory (pages, layouts, API routes)
components/         # Reusable UI and feature components
features/           # Feature modules (calendar, dashboard, settings)
hooks/              # Custom React hooks
lib/                # Core libraries (auth, db, market data, utils)
public/             # Static assets
services/           # Data fetching and business logic hooks
shared/             # Shared contexts and utilities
styles/             # Global styles (Tailwind, CSS)
```

## Authentication

- Uses JWT for access and refresh tokens.
- Tokens are signed and verified using the `jose` library.
- See [`lib/auth/jwt.ts`](lib/auth/jwt.ts) for implementation details.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run db:reset` — Reset the database (see `scripts/`)
- `npm run db:seed` — Seed the database with sample data

## Customization

- **Themes**: Easily switch between light and dark modes.
- **Settings**: Update user, API, data, notification, and security preferences from the settings page.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [jose](https://github.com/panva/jose) for JWT handling

---

Feel free to further customize this README to match your project's branding, add screenshots, or expand on any section!
