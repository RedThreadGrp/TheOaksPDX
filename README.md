# The Oaks Pub PDX Website

Modern, fast, and mobile-first website for The Oaks Pub PDX built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout with metadata and schema
│   ├── page.tsx           # Homepage
│   ├── menu/              # Food menu page
│   ├── drinks/            # Drinks menu page
│   ├── events/            # Events and specials
│   ├── contact/           # Contact page with form
│   ├── gallery/           # Photo gallery
│   ├── about/             # About page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── api/               # API routes
│   ├── sitemap.ts         # Dynamic sitemap generation
│   └── robots.ts          # Robots.txt generation
├── components/            # Reusable React components
│   ├── Navbar.tsx         # Navigation with mobile menu
│   ├── Footer.tsx         # Footer with NAP and hours
│   ├── StickyActionBar.tsx # Mobile sticky action bar
│   ├── MenuSection.tsx    # Menu section display
│   ├── MenuItem.tsx       # Menu item with dietary icons
│   ├── CTAButton.tsx      # Call-to-action button
│   └── OpenNowBadge.tsx   # Live open/closed status
├── content/               # JSON data files
│   ├── site.json          # Business info (NAP, hours, etc.)
│   ├── menu.food.json     # Food menu items
│   ├── menu.drinks.json   # Drinks menu items
│   └── events.json        # Events and specials
├── lib/                   # Utility functions and schemas
│   ├── content.ts         # Content loaders with validation
│   ├── schemas.ts         # Zod schemas for type safety
│   ├── hours.ts           # Hours calculation utilities
│   ├── analytics.ts       # Event tracking
│   └── schema.ts          # JSON-LD schema generation
└── public/                # Static assets (images, icons)
```

## 📝 Content Management

### Updating Business Information

Edit `content/site.json`:

```json
{
  "businessName": "The Oaks Pub PDX",
  "phone": "503-232-1728",
  "email": "info@theoakspubpdx.com",
  "address": {
    "street": "1621 SE Bybee Blvd",
    "city": "Portland",
    "state": "OR",
    "zip": "97202"
  },
  "hours": {
    "monday": { "open": "11:00", "close": "21:00" },
    ...
  }
}
```

### Updating Menus

Edit `content/menu.food.json` or `content/menu.drinks.json`:

```json
{
  "lastUpdatedISO": "2026-02-13T00:00:00.000Z",
  "sections": [
    {
      "id": "appetizers",
      "title": "Appetizers",
      "description": "Start your meal right",
      "items": [
        {
          "name": "Wings",
          "description": "Crispy chicken wings",
          "price": "$12",
          "dietary": ["gf"],
          "spicy": true
        }
      ]
    }
  ]
}
```

**Dietary Codes:**
- `v` = Vegetarian 🌱
- `vg` = Vegan 🌿
- `gf` = Gluten-Free 🌾
- `df` = Dairy-Free 🥛
- `n` = Contains Nuts 🥜

### Adding Events

Edit `content/events.json`:

```json
{
  "recurringEvents": [
    {
      "title": "Trivia Night",
      "description": "Test your knowledge!",
      "dayOfWeek": "wednesday",
      "time": "7:00 PM"
    }
  ],
  "upcomingEvents": [
    {
      "title": "Live Music",
      "description": "Local band performance",
      "date": "2026-03-15",
      "time": "8:00 PM"
    }
  ],
  "happyHour": {
    "enabled": true,
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "startTime": "3:00 PM",
    "endTime": "6:00 PM",
    "description": "Half-price appetizers and drink specials",
    "items": [
      { "name": "Draft Beer", "price": "$4" },
      { "name": "House Wine", "price": "$5" }
    ]
  }
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Set environment variables (optional):
   - `RESEND_API_KEY` - For email notifications from contact form
   - `CONTACT_TO_EMAIL` - Email address to receive contact form submissions
5. Deploy!

The site will automatically deploy on every push to `main` branch, with preview deployments for pull requests.

### Manual Deployment

```bash
# Build the site
npm run build

# The output will be in the `.next` folder
# Upload to any Node.js hosting provider
```

## 🔒 Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Email integration for contact form
RESEND_API_KEY=your_resend_api_key_here
CONTACT_TO_EMAIL=info@theoakspubpdx.com

# Site URL (used for sitemap and schema)
NEXT_PUBLIC_SITE_URL=https://www.theoakspubpdx.com
```

**Note:** Without `RESEND_API_KEY`, contact form submissions will be logged to the console but not emailed.

## ✨ Features

### Core Features
- ✅ Fast, mobile-first design
- ✅ Sticky mobile action bar (Call, Directions, Order, Menu)
- ✅ Live "Open Now" badge based on hours
- ✅ Dietary filter system for menus (Vegetarian, Vegan, GF, DF)
- ✅ Print-friendly menu styling
- ✅ Contact form with spam protection (honeypot + rate limiting)
- ✅ Responsive navigation with mobile hamburger menu

### SEO & Performance
- ✅ Server-side rendering with Next.js
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ JSON-LD Restaurant schema
- ✅ OpenGraph and Twitter Card metadata
- ✅ Optimized for Lighthouse scores ≥95

### Analytics
- ✅ Vercel Analytics integration
- ✅ Event tracking for user actions
- ✅ Speed Insights

## 🎨 Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
@theme {
  --color-primary-600: #16a34a;  /* Main brand color */
  --color-primary-700: #15803d;  /* Hover state */
  /* Add more custom colors as needed */
}
```

### Fonts

The site uses system fonts by default for performance. To add custom fonts, edit `app/layout.tsx`.

## 📱 Mobile Action Bar

The sticky action bar appears on mobile devices with 4 key actions:

1. **Call** - Direct phone call
2. **Directions** - Opens Google Maps
3. **Order** - Links to delivery platform (if configured) or email
4. **Menu** - Quick access to menu page

All interactions are tracked for analytics.

## 🧪 Testing

### Content Validation

Content is validated at build time using Zod schemas. Invalid content will fail the build with a helpful error message.

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Mobile action bar appears on mobile viewport
- [ ] NAP (Name, Address, Phone) is consistent across all pages
- [ ] Menu items render correctly
- [ ] Contact form submits successfully
- [ ] Hours display correctly
- [ ] "Open Now" badge shows correct status
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`

## 🐛 Troubleshooting

### Build Fails with "Module not found: fs"

This means a client component is trying to import server-side code. Make sure components that use `getSiteConfig()` or file system access are server components (no `'use client'` directive).

### Contact Form Not Sending Emails

Check that `RESEND_API_KEY` environment variable is set. Without it, submissions are logged but not emailed.

### Menu Not Showing

1. Check that `content/menu.food.json` or `content/menu.drinks.json` have sections defined
2. Verify JSON is valid
3. Check browser console for errors

## 📞 Support

For questions or issues:
- Email: info@theoakspubpdx.com
- Phone: 503-232-1728

## 📄 License

Copyright © 2026 The Oaks Pub PDX. All rights reserved.
