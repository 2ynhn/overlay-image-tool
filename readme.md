# Overlay Image Tool

A Chrome extension for UI developers and publishers — overlay a design mockup on a live page as a semi-transparent layer to visually compare layout accuracy.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)
![Version](https://img.shields.io/badge/version-1.4-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Overview

When publishing a web page, pixel-perfect comparison between the design draft and the actual implementation is essential. **Overlay Image Tool** injects your design image directly on top of the page as a fixed overlay, letting you spot spacing, alignment, and sizing issues at a glance — without switching between windows.

---

## Features

- **File upload or clipboard paste** — load an image by file picker or paste directly from clipboard (`Ctrl+V`) inside the popup
- **Direct page paste** — enable Quick Paste mode to paste an image overlay directly onto any webpage with `Ctrl+V`
- **Live position & size control** — set `background-position` and `background-size` via free-text fields; values are applied immediately on generate
- **Opacity control** — dial in transparency to see the page beneath the overlay
- **Grayscale toggle** — convert the overlay to grayscale to reduce visual noise when checking structure
- **Keyboard nudging** — fine-tune overlay position after applying without reopening the popup

  | Key | Movement |
  |---|---|
  | `↑` `↓` `←` `→` | 1px |
  | `Shift` + arrow | 10px |
  | `Ctrl` / `⌘` + arrow | 100px |

- **Session memory** — last used image and all settings are restored automatically when you reopen the popup
- **One-click remove** — clear the overlay from the current page instantly

---

## Installation

### From source (Developer mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder

The extension icon will appear in your toolbar.

---

## Usage

1. Click the **Overlay Image Tool** icon in the Chrome toolbar
2. Select an image file, or paste one from clipboard inside the popup
3. Adjust position, size, opacity, and grayscale as needed
4. Click **Generate** — the overlay appears on the current page
5. Use arrow keys to nudge the overlay position precisely
6. Click **Remove** (or reopen the popup and click Remove) to clear the overlay

### Quick Paste mode

Enable the **Enable Directly Paste** toggle to allow pasting an image directly onto any page with `Ctrl+V` — no need to open the popup each time.

---

## File Structure

```
overlay-image-tool/
├── manifest.json       # Extension manifest (MV3)
├── background.js       # Service worker — install/update handling
├── content.js          # Page-level script — paste & keyboard listeners
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
| `host_permissions: <all_urls>` | Allow operation on any page |

---

## License

MIT