// Navbar buttons
document.querySelector(".login-btn").addEventListener("click", () => {
  window.location.href = "login.html";
});
document.querySelector(".signup-btn").addEventListener("click", () => {
  window.location.href = "signup.html";
});
document.querySelector(".cta-btn").addEventListener("click", () => {
  window.location.href = "signup.html";
});

// Fade-in animation
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold: 0.2});
sections.forEach(section => observer.observe(section));

// Popup on course start
const popup = document.getElementById("popup-msg");
document.querySelectorAll(".start-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    popup.classList.remove("hidden");
    setTimeout(() => {
      popup.classList.add("hidden");
      window.location.href = "signup.html";
    }, 2000);
  });
});
