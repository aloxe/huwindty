// On page load or when changing themes, best to add inline in `head` to avoid FOUC
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
);

// add theme name in the document class list
const toggleTheme = () => {
  document.documentElement.classList.remove("dark", "light")
  const theme = document.querySelector('input[name=theme]:checked').value.substring(7);
  if (theme === "none") {
    localStorage.removeItem("theme");
    document.documentElement.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches)
  } else {
    document.documentElement.classList.add(theme)
    localStorage.theme = theme;
  }
}