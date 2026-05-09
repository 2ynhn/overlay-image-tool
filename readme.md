# Overlay Image Tool

A Chrome extension for UI developers — overlay a design mockup on a live page as a semi-transparent layer to compare layout accuracy.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)
![Version](https://img.shields.io/badge/version-1.4-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Overview

Overlay your design draft on any page to compare with the actual UI.

---

## Features

- **File upload or clipboard paste** — load an image via file picker, or paste from clipboard (`Ctrl+V`) inside the popup
- **Enable Directly Paste** — toggle on to paste an image overlay onto the page directly with `Ctrl+V`, without opening the popup
- **Position & size control** — set `background-position` and `background-size` via free-text input
- **Opacity** — adjust overlay transparency
- **Gray effect** — convert the overlay to grayscale to reduce visual noise
- **Arrow key move** — enable keyboard nudging to fine-tune overlay position after applying
- **Session memory** — last used image and all settings are restored automatically on next open
- **One-click remove** — clear the overlay from the current page instantly

---

## Keyboard Shortcuts

Arrow key move must be enabled in the popup options.

| Key | Movement |
|---|---|
| `↑` `↓` `←` `→` | 1px |
| `Shift` + arrow | 10px |
| `Ctrl` / `⌘` + arrow | 100px |

> Arrow key move is automatically disabled when focus is inside a text field, select box, or any editable element, to avoid conflicts with native browser behavior.

---

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder

---

## Usage

1. Click the **Overlay Image Tool** icon in the Chrome toolbar
2. Select an image file, or paste one from clipboard inside the popup
3. Adjust position, size, opacity, and options as needed
4. Click **Generate** — the overlay appears on the current page
5. Click **Remove** to clear the overlay

---

## File Structure

```
overlay-image-tool/
├── manifest.json       # Extension manifest (MV3)
├── background.js       # 
├── popup.html          # Extension popup markup
├── popup.js            # Popup logic — settings, preview, generate/remove
├── icon.png            # Extension icon
└── src/
    └── style/
        └── popup.css   # Popup styles
```

---

## Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Apply the overlay to the current tab |
| `scripting` | Inject the overlay element into the page |
| `storage` | Persist settings and last-used image across sessions |

---

## License

MIT
