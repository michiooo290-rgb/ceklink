export const meta = {
  name: "pixel-hero-upgrade",
  description: "Upgrade CekLink hero section with pixel-perfect canvas animation inspired by 21st.dev",
  phases: [
    { title: "Research", detail: "Analyze 21st.dev pixel-perfect hero component style" },
    { title: "Build", detail: "Create PixelCanvas component with cyber-themed animation" },
    { title: "Integrate", detail: "Replace Hero component and test" },
    { title: "Verify", detail: "Check build, fix bugs, verify visual quality" },
  ],
};

const CEKLINK_DIR = "C:/Users/iam/ceklink";

phase("Research");

const styleGuide = await agent(
  `I need to create a hero section background effect for a cybersecurity website called CekLink (URL security checker). The design is inspired by the "pixel-perfect-hero" component from 21st.dev which features:

1. A canvas-based pixel grid animation where pixels ripple/fade based on mouse position
2. Dark background with subtle grid of dots/pixels
3. Glassmorphism shimmer effect on elements
4. Smooth gradient overlays

The color palette for CekLink:
- Background: #0a0a0f (deep dark)
- Primary: #00ff88 (neon green)
- Accent: #00cc6a (dim green)
- Surface: #111118
- Border: #1a1a2e

Design the complete approach: what canvas API techniques to use, animation patterns, performance considerations, and how to integrate with Next.js 14. Focus on creating a visually stunning pixel grid that responds to mouse movement with a cyber/hacker aesthetic.`,
  { label: "research-style", phase: "Research", model: "sonnet", effort: "low" }
);

log("Style research complete. Proceeding to build.");

phase("Build");

const pixelCanvasCode = await agent(
  `Create a React component file at "${CEKLINK_DIR}/components/PixelCanvas.jsx" for a cybersecurity-themed pixel grid canvas background.

REQUIREMENTS:
1. Full-screen canvas behind content (absolute positioned, z-index: 0)
2. Grid of small dots/pixels (8-12px spacing) rendered on canvas
3. Pixels are dim (#1a1a2e) by default
4. Mouse interaction: pixels near cursor glow green (#00ff88) with fade-out radius
5. Subtle ambient animation: random pixels occasionally pulse green slowly
6. Performance: use requestAnimationFrame, only redraw changed regions if possible
7. Resize handler: canvas resizes with window
8. prefers-reduced-motion: disable mouse interaction and reduce animation
9. Canvas clears and redraws on resize
10. Include a subtle radial gradient overlay on top of canvas (pointer-events: none) that fades edges

CODE STYLE:
- "use client" directive at top
- useEffect + useRef + useCallback patterns
- Clean, well-commented code
- No external dependencies (pure canvas API)

Also create the CSS additions needed in "${CEKLINK_DIR}/app/globals.css":
- .pixel-canvas-container class (absolute inset-0, overflow hidden, pointer-events none on overlay)

Write BOTH files. Make sure the canvas has pointer-events: auto so it captures mouse, but the gradient overlay has pointer-events: none.`,
  { label: "build-canvas", phase: "Build", model: "sonnet", effort: "medium" }
);

log("PixelCanvas component built. Now integrating with Hero.");

const heroUpgrade = await agent(
  `Update the Hero component at "${CEKLINK_DIR}/components/Hero.jsx" to integrate the new PixelCanvas background.

Current Hero.jsx content should be read first, then modified:

CHANGES NEEDED:
1. Import PixelCanvas from "./PixelCanvas"
2. Place <PixelCanvas /> as the first child inside the hero section (before aurora-bg)
3. Keep the aurora-bg div but make it blend WITH the pixel canvas (both should be visible)
4. The aurora-bg should have mix-blend-mode: soft-light or screen to blend with pixel grid
5. Keep all existing content (badge, title, subtitle, CTA button)
6. Ensure z-index layering is correct: canvas (z-0) → aurora (z-[1]) → content (z-10)

Read the current file first, then apply the edits using the Edit tool. Do NOT rewrite the entire file - only modify what's needed.`,
  { label: "integrate-hero", phase: "Integrate", model: "sonnet", effort: "medium" }
);

log("Hero integrated. Now upgrading the glassmorphism shimmer effect.");

const shimmerUpgrade = await agent(
  `Update the global CSS at "${CEKLINK_DIR}/app/globals.css" to add enhanced glassmorphism shimmer effects inspired by 21st.dev's pixel-perfect-hero.

Read the current globals.css first, then ADD (don't replace existing) these new styles using the Edit tool:

1. .glass-shimmer class:
   - Before pseudo-element with shimmer gradient animation
   - Gradient moves from left to right creating a "shine" effect across the glass surface
   - Subtle, not overwhelming
   - Animation: shimmer-slide 6s ease-in-out infinite

2. Enhanced .glass-card class:
   - Add subtle inner glow on top edge (inset shadow)
   - Slightly more visible border on top

3. @keyframes shimmer-slide:
   - 0%: translateX(-100%)
   - 100%: translateX(200%)

4. .hero-title-gradient class:
   - For the main hero title text
   - Animated gradient text effect (green → emerald → cyan → green)
   - background-size: 300% 300%
   - animation: gradient-shift 8s ease infinite

5. @keyframes gradient-shift:
   - Background position animation for gradient text

Add these at the END of the existing globals.css file (before any @media queries if present). Use the Edit tool to append.`,
  { label: "shimmer-effects", phase: "Build", model: "sonnet", effort: "medium" }
);

log("Shimmer effects added. Moving to verification phase.");

phase("Integrate");

const heroFinalEdit = await agent(
  `Read "${CEKLINK_DIR}/components/Hero.jsx" and apply these final polish edits using the Edit tool:

1. Change the h1 title "Cek Keamanan" span to use the new .hero-title-gradient class instead of the inline gradient classes
2. Add .glass-shimmer class to the badge div (the "Lindungi diri dari phising" badge)
3. Ensure the "Mulai Cek Link" button uses .btn-glow class (it should already)

Read the file, find the exact strings, and use Edit to make minimal changes.`,
  { label: "hero-polish", phase: "Integrate", model: "sonnet", effort: "low" }
);

log("Hero polished. Final verification.");

phase("Verify");

const buildResult = await agent(
  `Run the Next.js build command for the CekLink project to verify everything compiles:

cd "${CEKLINK_DIR}" && npx next build

Report the output. If there are errors, read the relevant files and fix them using Edit tool, then re-run the build. Repeat until build succeeds.

After successful build, also verify:
1. PixelCanvas.jsx exists and has proper "use client" directive
2. Hero.jsx imports and uses PixelCanvas
3. globals.css has the new shimmer and gradient classes
4. No TypeScript/JS errors in any file

Report final status.`,
  { label: "verify-build", phase: "Verify", model: "sonnet", effort: "medium" }
);

return { buildResult, pixelCanvasCode, heroUpgrade, shimmerUpgrade, heroFinalEdit };
