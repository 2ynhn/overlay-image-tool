// Load the last used image and settings when the popup opens
document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  const bgPosition = document.getElementById("bgPosition");
  const bgSize = document.getElementById("bgSize");
  const opacityInput = document.getElementById("opacityInput");
  const grayscaleCheckbox = document.getElementById("grayscaleCheckbox");
  const arrowMoveCheckbox = document.getElementById("arrowMoveCheckbox");
  const generateButton = document.getElementById("generateButton");
  const removeButton = document.getElementById("removeButton");
  const previewImage = document.getElementById("previewImage");

  // Load stored data from localStorage
  const lastImage = localStorage.getItem("lastImage");
  const lastBgPosition = localStorage.getItem("lastBgPosition") || "center top";
  const lastBgSize = localStorage.getItem("lastBgSize") || "auto auto";
  const lastOpacity = localStorage.getItem("lastOpacity") || "0.3";
  const lastGrayscale = localStorage.getItem("lastGrayscale") === "true";

  bgPosition.value = lastBgPosition;
  bgSize.value = lastBgSize;
  opacityInput.value = lastOpacity;
  grayscaleCheckbox.checked = lastGrayscale;

  // Set button state based on image selection
  const updateButtonState = () => {
    const hasImage = imageInput.files.length > 0 || lastImage;
    generateButton.disabled = !hasImage;
    removeButton.disabled = !hasImage;
    if (!hasImage) {
      previewImage.style.backgroundImage = "none";
    } else {
	    const reader = new FileReader();
		reader.onload = function (e) {
		  const base64Image = e.target.result;
		  previewImage.style.backgroundImage = 'url('+ base64Image +')';
		  previewImage.style.backgroundSize = 'contain';
		  previewImage.style.backgroundRepeat = 'no-repeat';
		  previewImage.style.backgroundPosition = 'center';
		};
    }
  };

  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    updateButtonState();
	document.getElementById('alertPaste').style.display = 'none';
	
	const fileDataURL = file => new Promise((resolve,reject) => {
		let fr = new FileReader();
		fr.onload = () => resolve( fr.result);
		fr.onerror = reject;
		fr.readAsDataURL(file)
	});
	fileDataURL( file).
	then(data => {
		previewImage.style.backgroundImage = 'url('+ data +')';
		previewImage.style.backgroundSize = 'contain';
		previewImage.style.backgroundRepeat = 'no-repeat';
		previewImage.style.backgroundPosition = 'center';
	});
  });


  if (lastImage) {
    generateButton.disabled = false;
    removeButton.disabled = false;
    // Create a virtual file for the last image
    const blob = base64ToBlob(lastImage, "image/png");
    const file = new File([blob], "Your Last Image.png", { type: "image/png" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    imageInput.files = dataTransfer.files;

    // Show a preview of the image (optional)
    const reader = new FileReader();
    reader.onload = function (e) {
	  const base64Image = e.target.result;
	  previewImage.style.backgroundImage = 'url('+ base64Image +')';
	  previewImage.style.backgroundSize = 'contain';
	  previewImage.style.backgroundRepeat = 'no-repeat';
	  previewImage.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(file);
  }
  updateButtonState();
  
  
	window.addEventListener("paste", function(e){
		var item = Array.from(e.clipboardData.items).find(x => /^image\//.test(x.type));
		if(!item){
			document.getElementById('alertPaste').style.display = '';
			return;
		} else {
			document.getElementById('alertPaste').style.display = 'none';
		}
		var blob = item.getAsFile();
		var img = new Image();
		
		previewImage.style.backgroundImage = 'url('+ URL.createObjectURL(blob) +')';
		previewImage.style.backgroundSize = 'contain';
		previewImage.style.backgroundRepeat = 'no-repeat';
		previewImage.style.backgroundPosition = 'center';
		
		const file = new File([blob], "Your Last Image.png", { type: "image/png" });
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		imageInput.files = dataTransfer.files;
		updateButtonState();
	});
	
	
	
	// Quick paste 체크하기
	const checkbox = document.getElementById("enable-paste");
	const arrowCheckbox = document.getElementById("arrowMoveCheckbox");

	// 체크박스 상태 초기화
	chrome.storage.local.get(["enabled", "arrowEnabled"], (result) => {
		checkbox.checked = result.enabled || false;
		arrowCheckbox.checked = result.arrowEnabled || false;
	});

	// paste 체크박스 변경 시 처리
	checkbox.addEventListener("change", () => {
		chrome.storage.local.set({ enabled: checkbox.checked });
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (checkbox.checked) {
				chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: enablePasteListener });
			} else {
				chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: disablePasteListener });
			}
		});
	});

	// arrow 체크박스 변경 시 처리
	arrowCheckbox.addEventListener("change", () => {
		chrome.storage.local.set({ arrowEnabled: arrowCheckbox.checked });
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (arrowCheckbox.checked) {
				chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: enableArrowListener });
			} else {
				chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: disableArrowListener });
			}
		});
	});

	
});


document.getElementById("removeButton").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: removeImageThisPage,
      });
      // Close the popup
      window.close();
    });
});
function removeImageThisPage(){
	document.querySelectorAll(".custom-overlay").forEach((el) => el.remove());
}

// Save last used image and settings
document.getElementById("generateButton").addEventListener("click", () => {
  const imageInput = document.getElementById("imageInput");
  const bgPosition = document.getElementById("bgPosition").value || "center top";
  const bgSize = document.getElementById("bgSize").value || "auto auto";
  const opacity = document.getElementById("opacityInput").value || "0.3";
  const grayscale = document.getElementById("grayscaleCheckbox").checked;
  const alertElement = document.getElementById("alert");

  // Check if a valid file is uploaded
  const file = imageInput.files[0];
  if (!file || !file.type.startsWith("image/")) {
    alertElement.style.display = "block";
    return;
  }
  alertElement.style.display = "none";

  // Convert the image to base64
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64Image = event.target.result;

    // Save image and settings to localStorage
    localStorage.setItem("lastImage", base64Image.split(",")[1]); // Remove the "data:image/png;base64," prefix
    localStorage.setItem("lastBgPosition", bgPosition);
    localStorage.setItem("lastBgSize", bgSize);
    localStorage.setItem("lastOpacity", opacity);
    localStorage.setItem("lastGrayscale", grayscale);

    // Send the image and options to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: overlayImage,
        args: [base64Image, bgPosition, bgSize, opacity, grayscale]
      });

      // 오버레이 생성 후 리스너 상태 복원
      chrome.storage.local.get(["enabled", "arrowEnabled"], (result) => {
        if (result.enabled) chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: enablePasteListener });
        if (result.arrowEnabled) chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: enableArrowListener });
      });

      // Close the popup
      window.close();
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById("imageInput").addEventListener("change", function() {
	if (this.value) {
		this.setAttribute("data-title", this.value.replace(/^.*[\\\/]/, ''));
	} else {
		this.setAttribute("data-title", "No file chosen");
	}
});

// Helper function: Convert base64 to Blob
function base64ToBlob(base64, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

// Function to overlay the image on the current tab
function overlayImage(base64Image, bgPosition, bgSize, opacity, grayscale) {
  const overlay = document.createElement("div");
  const body = document.body;
  const html = document.documentElement;
  const bodyHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  const filter = grayscale ? "filter: grayscale(1);" : "";
  const overlayStyle = `
    background-image: url(${base64Image});
    background-size: ${bgSize};
    background-position: ${bgPosition};
    background-repeat: no-repeat;
    height: ${bodyHeight}px;
    opacity: ${opacity};
    ${filter}
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `;

  // Remove any existing overlay
  document.querySelectorAll(".custom-overlay").forEach((el) => el.remove());

  overlay.setAttribute("style", overlayStyle);
  overlay.classList.add("custom-overlay");
  document.body.appendChild(overlay);
}

// ── 페이지에 주입되는 paste/arrow 리스너 함수들 ──────────────────

function enablePasteListener() {
  if (window.__overlayPasteListener) return;
  window.__overlayPasteListener = (event) => {
    const item = Array.from(event.clipboardData.items).find(x => /^image\//.test(x.type));
    if (!item) return;
    const blob = item.getAsFile();
    const overlay = document.querySelector('.custom-overlay');
    if (overlay) {
      overlay.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
    }
  };
  document.addEventListener('paste', window.__overlayPasteListener);
}

function disablePasteListener() {
  if (!window.__overlayPasteListener) return;
  document.removeEventListener('paste', window.__overlayPasteListener);
  window.__overlayPasteListener = null;
}

function enableArrowListener() {
  if (window.__overlayArrowListener) return;
  window.__overlayArrowListener = (event) => {
    const overlay = document.querySelector('.custom-overlay');
    if (!overlay) return;
    const tag = document.activeElement?.tagName;
    const isEditable = document.activeElement?.isContentEditable;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable) return;

    let currentY = parseInt(getComputedStyle(overlay).backgroundPositionY, 10) || 0;
    let currentX = parseInt(getComputedStyle(overlay).backgroundPositionX, 10) || 0;
    let step = 1;
    if (event.shiftKey) step = 10;
    if (event.ctrlKey || event.metaKey) step = 100;

    if (event.key === 'ArrowUp')    { overlay.style.backgroundPositionY = `${currentY - step}px`; event.preventDefault(); }
    if (event.key === 'ArrowDown')  { overlay.style.backgroundPositionY = `${currentY + step}px`; event.preventDefault(); }
    if (event.key === 'ArrowLeft')  { overlay.style.backgroundPositionX = `${currentX - step}px`; event.preventDefault(); }
    if (event.key === 'ArrowRight') { overlay.style.backgroundPositionX = `${currentX + step}px`; event.preventDefault(); }
  };
  document.addEventListener('keydown', window.__overlayArrowListener);
}

function disableArrowListener() {
  if (!window.__overlayArrowListener) return;
  document.removeEventListener('keydown', window.__overlayArrowListener);
  window.__overlayArrowListener = null;
}
