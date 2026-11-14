Notification page split

Files:
- page.tsx: main page component and all existing page markup/state/handlers
- notification-types.ts: TypeScript types
- notification-data.ts: initial notification data
- notification-animations.ts: Framer Motion variants
- notification-icons.tsx: notification icon renderer

Put these files together in the same directory where your original notification page file was.
Keep the existing ../components/ui/Spotlight path valid from that directory.

No UI, text, styling, notification data, or interaction behavior was intentionally changed.
Only declarations were moved into separate files and imported into page.tsx.
