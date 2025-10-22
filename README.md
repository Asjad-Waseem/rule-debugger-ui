# Rule Debugging UI (Vite + React + TS + Tailwind)

Senior-quality, performant UI to understand and debug rule logic against transactions & feature vectors.

## Run locally

```bash
npm i
npm run dev
```

The app reads these files from `/public`:
- `transactions.json`
- `feature_vectors.json`
- `example_rules.json`

## Design & Approach

- Clear mental model: Rules (left), Evaluated rows (middle), Inspector (right).
- Explainability: evaluators return `{ fired, reasons[], facts{} }` for why/why-not.
- Param-driven: rule params are rendered from a schema; tweak and see results live.
- Performance: O(n) eval per rule selection; minimal re-renders; ready for row virtualization.
- Types: strict TypeScript across the app.
- Styling: Tailwind; accessible native controls; keyboard-friendly.

See `src/lib/ruleTemplates.ts` for each rule's evaluator and parameters.
