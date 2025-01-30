let pasteListener = null;
let keyupListener = null;

function overlayImage(base64Image, bgPosition, bgSize, opacity, grayscale) {
  const overlay = document.createElement("div");
  const body = document.body;
  const html = document.documentElement;
  const bodyHeight = Math.max(    body.scrollHeight,    body.offsetHeight,    html.clientHeight,    html.scrollHeight,    html.offsetHeight  );
  const filter = grayscale ? "filter: grayscale(1);" : "";
  const overlayStyle = `
    background-image: url(${base64Image});
    background-size: ${bgSize};
    background-position: ${bgPosition};
    background-repeat: no-repeat;
    height: ${bodyHeight}px;
    opacity: ${opacity};
    ${filter}
    position: absolute;    top: 0;    left: 0;    width: 100%;    min-height: 100vh;    pointer-events: none;    z-index: 9999;
  `;

  // Remove any existing overlay
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
// keyup 이벤트 처리 함수
const handleKeyup = (event) => {
	const overlay = document.querySelector('.custom-overlay');
	if (!overlay) return;
	let currentY = parseInt(getComputedStyle(overlay).backgroundPositionY, 10) || 0;
	let currentX = parseInt(getComputedStyle(overlay).backgroundPositionX, 10) || 0;
	let increment = 0;
	// 기본 이동 거리 설정
	if (event.key === 'ArrowUp') increment = -1;
	if (event.key === 'ArrowDown') increment = 1;
	if (event.key === 'ArrowLeft') increment = -1;
	if (event.key === 'ArrowRight') increment = 1;
	// Shift 키 조합
	if (event.shiftKey) increment *= 10;
	// Ctrl(CtrlKey) 또는 Command(MetaKey) 키 조합
	if (event.ctrlKey || event.metaKey) increment *= 100;
	if (increment !== 0 && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
		overlay.style.backgroundPositionY = `${currentY + increment}px`;
		event.preventDefault(); // 기본 동작 방지
	}
	if (increment !== 0 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
		overlay.style.backgroundPositionX = `${currentX + increment}px`;
		event.preventDefault(); // 기본 동작 방지
	}
};
// 상태에 따라 이벤트 리스너를 등록/해제
const updateListeners = (isEnabled) => {
	if (!keyupListener) {
      keyupListener = handleKeyup;
      document.addEventListener("keydown", keyupListener);
    }
	
  if (isEnabled) {
    if (!pasteListener) {
      pasteListener = handlePaste;
      document.addEventListener("paste", pasteListener);
    }
	console.log("You Can Paste Image on Website\nMove 1px : use Arrow Key(↑ ↓ ← →)\nMove 10px : Shift + arrow\nMove 100px : Ctrl + arrow");
    
  } else {
    if (pasteListener) {
      document.removeEventListener("paste", pasteListener);
      pasteListener = null;
    }
    if (keyupListener) {
      document.removeEventListener("keydown", keyupListener);
      keyupListener = null;
    }
    console.log("Paste and Shortcut disabled.");
  }
};
// 탭이 로드되었을 때 로컬 스토리지에서 상태 확인
chrome.storage.local.get("enabled", (result) => {
  const isEnabled = result.enabled || false;
  updateListeners(isEnabled);
});
// 스토리지 변경 시 리스너 업데이트
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.enabled) {
    const isEnabled = changes.enabled.newValue;
    updateListeners(isEnabled);
  }
});