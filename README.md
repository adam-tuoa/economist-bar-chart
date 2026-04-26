# Economist Bar Chart

A horizontal bar chart recreating _The Economist_'s "Escape artists" piece on laboratory-acquired infections (1970–2021). Built with React, Vite, and D3.

Built following Yan Holtz's [D3 Loves React](https://www.d3-loves-react.com/) course — module on **scales**.

## Concepts covered

- `scaleLinear` — maps counts to bar pixel widths
- `scaleBand` with `.bandwidth()` and `.padding()` — handles bar heights and y-positions
- `xScale.ticks()` for hand-rolled axis labels and gridlines
- Conditional label placement: inside the bar (white text) when it fits, outside (blue) when it doesn't, with a single cutoff between the two
- SVG `feMorphology` filter for a glyph-shaped white halo behind outside labels
- Responsive layout via `useRef` + `ResizeObserver`, keeping text size constant while bar widths flex

## Run locally

```bash
npm install
npm run dev
```
