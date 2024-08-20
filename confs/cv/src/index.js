document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle");

  toggles.forEach(toggle => {
      toggle.addEventListener("click", () => {
          const content = toggle.nextElementSibling;
          if (content)
            content.style.display = content.style.display === "none" ? "block" : "none";
      });
  });
});
