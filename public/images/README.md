# Image Assets

Place your custom images here. Recommended specifications:

## Hero Background
- Filename: `hero-bg.jpg` or `hero-bg.png`
- Dimensions: 1920x1080px minimum
- Style: Dark, abstract, fintech-themed (world map, network, technology)

## Section Backgrounds
- Filename: `features-bg.jpg`, `trust-bg.jpg`, etc.
- Dimensions: 1920x800px minimum
- Style: Subtle, low-contrast patterns that work behind text

## General Guidelines
- Use WebP or optimized JPG for photos (target < 500KB each)
- Use SVG for icons and logos
- All images should work on both light and dark backgrounds
- After adding images, update the relevant section component to reference them

## Usage in Components
To use an image in a section, reference it as:
```tsx
style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
// or with Next.js Image:
<Image src="/images/hero-bg.jpg" alt="..." fill className="object-cover" />
```
