# better dev

A tiny, calm web app that hands you one piece of real advice for becoming a
better developer every time you open it. Refresh the page, or tap **New advice**,
and you get another. Like one? Save it with a tap, or download it as an image to
keep or share. Light and dark themes included.

The advice is not generated. Every line is attributed to a real person or book,
written in plain English, and gathered from books, talks and writing by
engineers worth listening to. See [CREDITS.md](./CREDITS.md) for the full list of
sources.

## Features

- **One advice per visit.** A random, sourced piece of advice on every load.
- **New advice** button to keep reading without refreshing, and it avoids
  repeating the one you just saw.
- **Save the ones you like.** Liked advice is kept in your browser via
  `localStorage`, with a dedicated **Saved** tab. Nothing leaves your device.
- **Download as an image.** Export any advice card as a clean PNG that matches
  the current theme, for the daily card or any saved one.
- **Light and dark themes** that follow your system preference on first visit and
  remember your choice after that.
- **Responsive and accessible.** Works from phone to desktop, keyboard friendly,
  with sensible labels and reduced motion support.
- **Over 110 pieces of advice**, enough to read one a day for months without a
  repeat.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint the project |

## Tech

- [Vite](https://vite.dev/) and [React](https://react.dev/)
- [html-to-image](https://github.com/bubkoo/html-to-image) for the PNG export
- [Vitest](https://vitest.dev/) and
  [Testing Library](https://testing-library.com/) for tests

## How it is built

```
src/
  data/advice.js        The advice dataset, each item with text, author, source, tags
  hooks/useTheme.js     Light/dark theme with system preference and persistence
  hooks/useSavedAdvice.js  Saved advice backed by localStorage
  lib/pickAdvice.js     Random selection that avoids immediate repeats
  lib/exportImage.js    Card to PNG export
  components/           AdviceCard, SavedView, icons
  App.jsx               Ties it together: tabs, actions, theme toggle
```

## Tests

The suite covers the advice data (every item is complete, ids are unique, and the
text stays plain with no em dashes or emoji), the saved-advice and theme logic,
and the main user flows: showing advice, getting a new one, saving, switching to
the Saved tab, and toggling the theme.

```bash
npm test
```

## Credits

The idea was sparked by Addy Osmani's reflections after 14 years at Google. The
advice itself comes from many engineers and books, each credited on its card and
listed in [CREDITS.md](./CREDITS.md).

## License

MIT
