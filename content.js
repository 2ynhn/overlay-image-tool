let pasteListener = null;
let keydownListener = null;

function overlayImage(base64Image, bgPosition, bgSize, opacity, grayscale) {
  const overlay = document.createElement("div");
  const body = document.body;
  const html = document.documentElement;
  const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  const filter = grayscale ? "filter: grayscale(1);" : "";
  const overlayStyle = `
    background-image: url(${base64Image});
    background-size: ${bgSize};
    background-position: ${bgPosition};
    background-repeat: no-repeat;
    height: ${bodyHeight}px;
    opacity: ${opacity};
    ${filter}
    position: absolute; top: 0; left: 0; width: 100%; min-height: 100vh; pointer-events: none; z-index: 9999;
  `;
  document.querySelectorAll(".custom-overlay").forEach((el) => el.remove());
  overlay.setAttribute("style", overlayStyle);
  overlay.classList.add("custom-overlay");
  document.body.appendChild(overlay);
}

// paste 이벤트 처리 함수
const handlePaste = (event) => {
  const items = event.clipboardData?.items;
  if (items) {
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        overlayImage(URL.createObjectURL(file), 'center top', 'auto auto', '.3', false);
      }
    }
  }
};

// keydown 이벤트 처리 함수
const handleKeydown = (event) => {
  const overlay = document.querySelector('.custom-overlay');
  if (!overlay) return;

  // 입력 요소에 포커스가 있을 경우 화살표 이동 비활성화 (충돌 방지)
  const tag = document.activeElement?.tagName;
  const isEditable = document.activeElement?.isContentEditable;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable) return;

  let currentY = parseInt(getComputedStyle(overlay).backgroundPositionY, 10) || 0;
  let currentX = parseInt(getComputedStyle(overlay).backgroundPositionX, 10) || 0;
  let increment = 0;

  if (event.key === 'ArrowUp') increment = -1;
  if (event.key === 'ArrowDown') increment = 1;
  if (event.key === 'ArrowLeft') increment = -1;
  if (event.key === 'ArrowRight') increment = 1;

  if (event.shiftKey) increment *= 10;
  if (event.ctrlKey || event.metaKey) increment *= 100;

  if (increment !== 0 && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    overlay.style.backgroundPositionY = `${currentY + increment}px`;
    event.preventDefault();
  }
  if (increment !== 0 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    overlay.style.backgroundPositionX = `${currentX + increment}px`;
    event.preventDefault();
  }
};

// paste 리스너 등록/해제
const updatePasteListener = (isEnabled) => {
  if (isEnabled) {
    if (!pasteListener) {
      pasteListener = handlePaste;
      document.addEventListener("paste", pasteListener);
    }
  } else {
    if (pasteListener) {
      document.removeEventListener("paste", pasteListener);
      pasteListener = null;
    }
  }
};

// arrow 리스너 등록/해제
const updateKeydownListener = (isEnabled) => {
  if (isEnabled) {
    if (!keydownListener) {
      keydownListener = handleKeydown;
      document.addEventListener("keydown", keydownListener);
    }
  } else {
    if (keydownListener) {
      document.removeEventListener("keydown", keydownListener);
      keydownListener = null;
    }
  }
};

// 초기 상태 로드
chrome.storage.local.get(["enabled", "arrowEnabled"], (result) => {
  updatePasteListener(result.enabled || false);
  updateKeydownListener(result.arrowEnabled || false);
});

// 스토리지 변경 감지
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;
  if (changes.enabled !== undefined) {
    updatePasteListener(changes.enabled.newValue);
  }
  if (changes.arrowEnabled !== undefined) {
    updateKeydownListener(changes.arrowEnabled.newValue);
  }
});
