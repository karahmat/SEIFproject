//animate the navigation bar
const toggleButton = document.querySelector(".navbar-toggle");
const navBarLinks = document.querySelectorAll(".navbar-links");
toggleButton.addEventListener("click", () => {
    for (let i=0; i<navBarLinks.length; i++) {
        navBarLinks[i].classList.toggle("active");
    }
});