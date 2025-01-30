chrome.runtime.onInstalled.addListener((details) => {
	console.log("Extension installed!");
	
  if (details.reason === "update") {
    // 새 버전 확인
    chrome.storage.local.get("lastVersion", (result) => {
      const lastVersion = result.lastVersion || "unknown";
      const currentVersion = chrome.runtime.getManifest().version;
      // 이전 버전과 현재 버전 비교
      if (lastVersion !== currentVersion) {
        chrome.storage.local.set({ newVersion: true }); // 새 버전 알림 설정
      }
      // 현재 버전을 저장
      chrome.storage.local.set({ lastVersion: currentVersion });
    });
  } else if (details.reason === "install") {
    // 처음 설치 시 버전 저장
    chrome.storage.local.set({ lastVersion: chrome.runtime.getManifest().version });
  }
});