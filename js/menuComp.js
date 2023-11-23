const hamburgerIcon = document.getElementById("hamburgerIcon");


hamburgerIcon.addEventListener("click", function () {
    releaseMenu();
})

function releaseMenu() {
    console.log("HELLO WORLD");
    console.log("HELLO WORLD");
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}