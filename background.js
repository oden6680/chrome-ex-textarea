chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-checkbox") {
    handleToggleCheckboxCommand();
  }
});

function handleToggleCheckboxCommand() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleCheckbox,
      });
    }
  });
}

function toggleCheckbox() {
  const textarea = document.activeElement;
  if (textarea.tagName.toLowerCase() !== "textarea") return;

  const start = textarea.selectionStart;
  const value = textarea.value;
  const lineStart = getLineStart(value, start);
  const lineEnd = getLineEnd(value, start);
  const line = value.substring(lineStart, lineEnd);

  if (isUncheckedCheckbox(line)) {
    updateCheckbox(textarea, value, lineStart, lineEnd, start, "[ ]", "[x]");
  } else if (isCheckedCheckbox(line)) {
    updateCheckbox(textarea, value, lineStart, lineEnd, start, "[x]", "[ ]");
  }

  function getLineStart(value, start) {
    return value.lastIndexOf("\n", start - 1) + 1;
  }

  function getLineEnd(value, start) {
    const end = value.indexOf("\n", start);
    return end === -1 ? value.length : end;
  }

  function isUncheckedCheckbox(line) {
    return /^\s*- \[ \]/.test(line);
  }

  function isCheckedCheckbox(line) {
    return /^\s*- \[x\]/.test(line);
  }

  function updateCheckbox(textarea, value, lineStart, lineEnd, start, oldSymbol, newSymbol) {
    textarea.value = value.substring(0, lineStart) + line.replace(oldSymbol, newSymbol) + value.substring(lineEnd);
    textarea.selectionStart = textarea.selectionEnd = start;
  }
}
