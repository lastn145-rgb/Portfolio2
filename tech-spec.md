# Tech Spec — Today Portfolio

Single-page static portfolio. HTML/CSS/JS only. Deployed to Google Blogger (no build step, no server, no frameworks).

---

## Dependencies

| Package | Source | Purpose |
|---------|--------|---------|
| Google Fonts (Poppins, Inter) | `<link>` tag | Typography |
| Lucide Icons | CDN `<script>` | All icons (nav, services, contact, footer, UI) |

No other external libraries. GSAP was evaluated but all animations can be achieved with CSS transitions + IntersectionObserver + `requestAnimationFrame`. Keeping dependency count at zero beyond fonts and icons simplifies Blogger deployment.

---

## Component Inventory

### Layout (shared across page)

| Component | Source | Notes |
|-----------|--------|-------|
| Navigation Bar | Custom | Fixed, transparent→frosted on scroll, hamburger on mobile |
| Footer | Custom | 4-column grid, dynamic year, scroll-to-top button |
| Loading Screen | Custom | Full-screen overlay, auto-dismisses after 1.8s |
| Cursor Glow | Custom | Desktop only, `requestAnimationFrame` mouse tracking |
| Background Grid | Custom | CSS `repeating-linear-gradient`, fixed layer |

### Sections (page-specific, single use)

| Component | Source | Notes |
|-----------|--------|-------|
| Hero Section | Custom | Split layout, typing animation, particle canvas, code card |
| About Section | Custom | Split layout, stats with count-up animation |
| Skills Section | Custom | Skill bars, SVG circular progress, tech icon grid |
| Projects Section | Custom | Filter tabs, 6 project cards with tilt effect |
| Services Section | Custom | 6 glassmorphism service cards |
| Testimonials Section | Custom | Auto-slide carousel, 5 testimonials |
| Contact Section | Custom | Split layout, form with floating labels + validation |

### Reusable Components (shared patterns)

| Component | Source | Used By |
|-----------|--------|---------|
| Glass Card | Custom | Services, testimonials, project cards, contact form |
| Primary Button | Custom | Hero, filter tabs, contact form |
| Secondary Button | Custom | Hero, project card actions |
| Ghost Button | Custom | Nav links, project card actions |
| Section Header | Custom | All sections (label + title + subheading pattern) |
| Animated Divider | Custom | All sections (gradient line with shimmer) |

### Hooks/Logic (JavaScript modules)

No React hooks — all vanilla JS utilities:

| Module | Purpose |
|--------|---------|
| `typingAnimation()` | Hero role typing/deleting cycle |
| `particleCanvas()` | Hero background particle network |
| `scrollReveal()` | IntersectionObserver-based fade-up reveal |
| `countUp()` | Animated number counting (stats, skill %) |
| `testimonialSlider()` | Auto-slide carousel with nav arrows + dots |
| `projectFilter()` | Category filtering with fade transition |
| `projectTilt()` | 3D mouse-tracking tilt on project cards |
| `cardGlow()` | Mouse-tracking radial glow inside cards |
| `navbarBehavior()` | Scroll-based transparency + active section detection |
| `mobileMenu()` | Hamburger slide-in panel + overlay |
| `formValidation()` | Client-side validation with visual feedback |
| `cursorGlow()` | Desktop cursor-following radial glow |
| `loadingScreen()` | Orchestrated loading + dismiss + hero entrance |

---

## Animation Implementation

| Animation | Library / Approach | Implementation | Complexity |
|-----------|-------------------|----------------|------------|
| Hero choreographed entrance | CSS transitions | `.loaded` class triggers staggered CSS transitions with incremental `transition-delay` values (200ms–1500ms) on each element | Medium |
| Loading screen dismiss | CSS transition | `opacity: 1→0` over 600ms, then `display: none` | Low |
| Scroll reveal (fade-up) | IntersectionObserver | Add `.revealed` class when element enters viewport; CSS handles `opacity 0→1` + `translateY 40→0` over 800ms | Low |
| Scroll reveal (slide-in) | IntersectionObserver | Same as above but with `translateX ±60→0`, 1000ms duration | Low |
| Staggered reveals | CSS `nth-child` / data attrs | Incremental `transition-delay` (100ms per item) on siblings | Low |
| Typing animation | Vanilla JS | `setTimeout`-based character-by-character append/delete cycling through 4 strings. Cursor blink via CSS `step-end` keyframes | Medium |
| Skill bar fill | IntersectionObserver | Animate `width` property from 0% to target. Shimmer pseudo-element with CSS `keyframes` sweep | Low |
| Circular progress | IntersectionObserver + CSS | SVG `stroke-dashoffset` animation from full circumference to target. Counter increments via JS `requestAnimationFrame` | Medium |
| Stats count-up | IntersectionObserver | `requestAnimationFrame` loop incrementing number with eased interpolation over 1500ms | Low |
| Particle network | Canvas 2D API | `requestAnimationFrame` loop: update positions, draw particles + connecting lines within distance threshold. Pause when hero not visible (IntersectionObserver) | High |
| Parallax floating shapes | `requestAnimationFrame` | Update `translateY` based on `scrollY * factor` per shape. CSS `keyframes` handle continuous rotation/float | Medium |
| Project card 3D tilt | Vanilla JS | `mousemove` → calculate relative position → `perspective(1000px) rotateX/Y(±8deg)`. `mouseleave` → reset transition | Medium |
| Mouse tracking glow | Vanilla JS | `mousemove` on card → update `::before` pseudo-element position to cursor center. Fade in/out on enter/leave | Low |
| Testimonial slider | Vanilla JS | `setInterval` auto-advance every 5s. `translateX` transition between slides. Pause on hover. Touch swipe detection | Medium |
| Project filter | Vanilla JS | Toggle `.hidden` class with CSS `opacity + scale` transition (400ms). Re-layout via CSS grid | Low |
| Navbar scroll state | Scroll event (passive) | Toggle `.scrolled` class at scrollY > 80px. Throttled via `requestAnimationFrame` | Low |
| Active section highlight | IntersectionObserver | Track all sections, update `.active` on nav link when section ~40% in viewport | Low |
| Mobile menu slide | CSS transition | `transform: translateX(100%)→0` on panel. Overlay opacity fade. Scroll lock via `overflow: hidden` on body | Low |
| Cursor glow | `requestAnimationFrame` | Update fixed-position div to `clientX/Y` offset by radius. Only active on `pointer: fine` devices | Low |
| Neon gradient text | CSS `keyframes` | `background-position` shift on 200% width gradient, 4s infinite cycle | Low |
| Animated divider | IntersectionObserver | Width `0→60px` on scroll view + continuous shimmer pseudo-element | Low |
| Scroll indicator fade | Scroll event | `opacity: 1→0` when scrollY > 100px | Low |
| Form floating labels | CSS + JS | Label transitions on `:focus` or `.has-value` class (toggled by input event). CSS handles size/position/color transitions | Low |
| Form success animation | CSS + JS | Button background/color/icon swap with CSS transition. `setTimeout` to reset after 3s | Low |
| Service card icon bounce | IntersectionObserver | `scale: 0.8→1.0` with `cubic-bezier` back-out easing, triggered slightly before card text reveal | Low |
| Card hover lift + glow | CSS transitions | `translateY(-4px)`, border-color change, box-shadow expansion on `:hover`. 400ms cubic-bezier | Low |
| Button hover glow | CSS transitions | `box-shadow` expansion with accent color glow. `scale(1.02)` on hover | Low |

---

## State & Logic

No state management library needed. All state is local and minimal:

- **Typing animation state:** Current string index, current character index, isDeleting flag, isPaused flag. Stored in closure variables.
- **Testimonial slider state:** Current slide index, auto-slide interval ID, isPaused flag, touch start X. Stored in closure variables.
- **Particle animation state:** Array of particle objects {x, y, vx, vy, radius, opacity}. Animation frame ID for pause/resume.
- **Scroll reveal state:** IntersectionObserver instances. No mutable state beyond DOM class toggling.
- **Form state:** Field validity map, submission status (idle/loading/success). Checked on submit.
- **Navbar state:** Previous scrollY (for show/hide on direction change), isMenuOpen flag.

All module communication is one-way: events trigger DOM class changes, CSS handles the visual transitions. No shared state between modules.

---

## Other Key Decisions

**No GSAP:** The design's animation requirements (fade-ups, slide-ins, stagger, typing, canvas particles, CSS transitions) are all achievable with vanilla JS + CSS. GSAP would add ~90KB for features easily replicated with IntersectionObserver and `requestAnimationFrame`. The project targets Blogger deployment where minimizing external dependencies is valuable.

**No Devicon for tech stack:** The design specifies 8 tech icons (HTML5, CSS3, JS, React, Git, Figma, VS Code, Node.js). Devicon would require another CDN dependency. Lucide provides generic but clean icons (`code-2`, `file-code`, `braces`, etc.) that fit the aesthetic. Alternatively, simple inline SVGs for the specific brand logos (all publicly available) can be embedded directly in HTML at ~1KB total, eliminating the Devicon dependency entirely.

**Blogger deployment strategy:** All code is inline-able. The HTML file references `style.css` and `script.js` via relative paths. For Blogger, these can be:
1. Uploaded to Blogger's file host and referenced by absolute URL, OR
2. Inlined into `<style>` and `<script>` tags within the template

Images are referenced by relative path (`images/...`). For Blogger, these must be uploaded to an image host (Imgur, Cloudinary) or Blogger's image storage, with URLs updated accordingly.

**Particle performance:** Canvas runs at 30fps (skip every other frame) to reduce CPU usage. On mobile, particle count drops from 40 to 15, connection distance drops from 150px to 100px. IntersectionObserver pauses the animation loop when hero is off-screen.

**Font loading:** Google Fonts loaded with `display=swap` to prevent FOIT. A system font stack fallback (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) is defined in CSS for the swap period.
