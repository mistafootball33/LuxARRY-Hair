# LuxARRY Hair 💗

Luxury hair e-commerce landing page — **black satin, hot pink gloss, champagne gold, diamond shimmer**.

Built as a fully responsive, dependency-free static site (pure HTML/CSS/JS — no build step).

## Sections

- Animated promo marquee (free shipping / LUX20 / Afterpay)
- Sticky glass header with mobile slide-in menu + live cart badge
- Hero with diamond & pink-gloss wordmark
- Bundle tiers (Basic / Signature / Ultimate)
- "Luxury Hair — Made Just For You" statement
- Texture categories (Straight / Curly / Wavy)
- "Beauty That Begins With You" polaroid feature
- Best sellers with add-to-cart toast
- Customer feedback / reviews
- "Let's Get Social" Instagram grid
- Newsletter capture bar (10% off)
- Full footer with quick links, customer care, payments

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8080
```

## Swapping in real photography

All imagery slots use the `.photo` class with styled satin/sparkle placeholders so the layout ships complete without licensed assets. To use real photos, add a background image to any slot:

```css
.photo--hero { background: url("../img/hero.jpg") center/cover; }
.photo--prod1 { background: url("../img/body-wave.jpg") center/cover; }
```

Slot names: `photo--hero`, `photo--tier1..3`, `photo--straight/curly/wavy`, `photo--pol1/pol2`, `photo--prod1..4`, `photo--rev1..3`, `photo--ig1..8`.

## Stack

- Google Fonts: Anton, Great Vibes, Playfair Display, Montserrat
- CSS custom properties, grid/flexbox, `background-clip: text` treatments
- IntersectionObserver scroll reveals, `prefers-reduced-motion` respected
- No frameworks, no dependencies

---

© 2025 LuxARRY Hair. All Rights Reserved.
