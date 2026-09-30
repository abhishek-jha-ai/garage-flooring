# Titan Garage Flooring — Conversion Demo

A mobile-first landing experience that turns Instagram and Facebook ad traffic into estimate requests:
**Ad → Hero → Explore projects/finishes → Trust → Free estimate (4 quick steps).**

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

## Deploy (Vercel)

Import the folder into Vercel. No configuration is needed. Optional environment variables are listed in `.env.example`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `true` (default) shows the small “Interactive concept” tag and sets `noindex`. Set to `false` at launch. |
| `LEAD_WEBHOOK_URL` | POSTs every estimate request as JSON (works with Zapier, Make, n8n or a GoHighLevel inbound webhook). |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Loads GA4 or the Meta Pixel only when set. |

## Structure

```
src/
  app/                 layout (SEO, fonts, JSON-LD), page, /api/estimate
  components/          Hero, TrustBar, ProjectExplorer (+ExplorerStage), BeforeAfter,
                       FinishExplorer, ProjectGallery (+Lightbox), WhyTitan, Testimonials,
                       EstimateWizard (+EstimateContext), StickyCTA, Footer
  lib/
    site.ts            business facts: phone, address, rating, socials
    content.ts         project categories, hotspots, finishes, gallery, wizard options
    analytics.ts       trackEvent() with the GA4, Meta and dev-console providers in one place
    leads/             validation + pluggable lead adapters (console, webhook)
```

## Swapping content

- **Photos:** replace the files in `public/images/` or change the paths in `src/lib/content.ts`. No component changes are needed.
- **360° / Matterport:** add a view such as `{ kind: "matterport", modelId, label }` or `{ kind: "pano360", src, label }` to a category's `views`. `ExplorerStage` already renders both.
- **Reviews:** add verbatim reviews to the `testimonials` array in `Testimonials.tsx`.
- **Finishes:** “Granite / Domino / Stone / Graphite / Custom” are representative looks. Titan's real blend names are in `flakeBlends`.
- **Lead destinations:** append an adapter to `src/lib/leads/adapters.ts` (HubSpot, Twilio SMS, Resend email, …).
- **Logo:** `Helmet` in `components/Logo.tsx` is an approximation of the Spartan mark. Replace it with Titan's vector logo.

## Analytics events

`estimate_started`, `estimate_step_completed`, `estimate_submitted`, `estimate_abandoned`,
`project_type_selected`, `explorer_view_changed`, `hotspot_opened`, `finish_selected`,
`before_after_interaction`, `gallery_filtered`, `gallery_opened`, `phone_clicked`, `reviews_clicked`.
UTM, `fbclid` and `gclid` parameters are attached to every lead.

## Handy links

`/#estimate` opens the estimate flow directly, which is useful as an ad or bio link.
