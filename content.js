document.addEventListener("keydown", function (event) {
  const textarea = document.activeElement;

  if (textarea.tagName.toLowerCase() !== "textarea") return;

  const { key, shiftKey } = event;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", start);
  const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);

  if (key === "Tab") {
    event.preventDefault();

    if (shiftKey) {
      if (value.substring(lineStart, lineStart + 2) === "  ") {
        textarea.value = value.substring(0, lineStart) + value.substring(lineStart + 2);
        textarea.selectionStart = textarea.selectionEnd = start - 2;
      } else if (value.substring(lineStart, lineStart + 1) === " ") {
        textarea.value = value.substring(0, lineStart) + value.substring(lineStart + 1);
        textarea.selectionStart = textarea.selectionEnd = start - 1;
      }
    } else {
      if (line.trim() === "-" || line.trim().startsWith("- ")) {
        textarea.value = value.substring(0, lineStart) + "  " + value.substring(lineStart);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      } else {
        textarea.value = value.substring(0, start) + " " + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
    }
  }

  if (key === "Enter" && start === end) {
    if (line.startsWith("|") && line.endsWith("|")) {
      event.preventDefault();
      const rowTemplate = "\n" + "| " + " | ".repeat(line.split("|").length - 3) + " |";
      textarea.value = value.substring(0, start) + rowTemplate + value.substring(start);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }
  }
});
