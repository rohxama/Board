# Kanvas

Kanvas is a browser-based diagramming and whiteboard app for creating flowcharts, concept maps, wireframes, and lightweight visual notes in a focused, distraction-free workspace. It is designed for quick ideation and structured drawing without the overhead of a heavyweight desktop diagramming tool.

The app combines a clean floating toolbar, canvas-based drawing tools, keyboard shortcuts, and local project persistence so users can sketch, refine, and export ideas efficiently.

## What it is

Kanvas is a React + Vite application built on top of Konva for canvas rendering. It offers an Excalidraw-inspired drawing experience with:

- shape creation and manipulation
- canvas panning and zooming
- selection and editing
- styling controls for strokes, fills, and opacity
- local board saving and restore
- import/export of board data and PNG snapshots

The project is intended as a fast, browser-first whiteboard for individual creative work and diagramming sessions.

## Features

- Draw rectangles, ellipses, arrows, lines, and freehand pen strokes
- Select, move, duplicate, and delete objects
- Keyboard shortcuts for common actions like undo, redo, delete, copy, paste, and zoom
- Zoom controls with fit-to-content behavior
- Grid-based canvas and snapping support
- Style panel for stroke, fill, dash, and width adjustments
- Board creation, autosave, restore, and local persistence
- Previous-board recovery flow for returning users
- Empty-state prompts to guide new users on an empty board
- Theme support with dark and light modes
- JSON import/export for board files
- PNG export for snapshots and presentations

## Tech Stack

- React
- Vite
- Konva
- react-konva
- JavaScript / JSX
- CSS variables and custom styling
- Browser localStorage for persistence

## Installation

1. Clone the repository.
2. In the project root, install dependencies:

   npm install

## Run Command

To start the app in development mode:

npm run dev -- --host 0.0.0.0

This launches the local Vite dev server so the board can be opened in the browser.

## Build Command

To create a production build:

npm run build

To preview the production build locally:

npm run preview

## Known Limitations

- This is a lightweight single-user whiteboard rather than a collaborative multi-user platform.
- Persistence is browser-local and does not currently include cloud sync or team sharing.
- Some advanced diagramming features found in mature products are not yet implemented, such as deep alignment guides, multi-board collaboration, and complex imported asset handling.
- The current export/import flow is designed for local board portability rather than full platform-level versioning.
- Image and board behaviors are optimized for browser-based editing workflows rather than enterprise-scale document management.

## Future Plans

- Add richer alignment and distribution tools for cleaner diagram layouts
- Improve shape library coverage and reusable templates
- Expand export options and board management workflows
- Add stronger editing polish for text, resize handles, and multi-selection ergonomics
- Introduce more advanced styling presets and design tokens
- Explore collaborative real-time editing and shared board links
- Add deeper performance optimizations for larger boards and more complex documents

## Project Status

The project has been verified locally with:

- npm test
- npm run build

These checks were run successfully before this README was added, confirming the current app is in a stable, buildable state for local development and testing.
