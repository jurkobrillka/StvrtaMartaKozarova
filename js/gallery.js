console.log("loaded");

let gallery = document.getElementById("gallery");
let filter = document.getElementById("filter");
let clickedBtn = 0;
let visiblePhoto = [];
let currentImageIndex = 0;
let clicked;

filter.addEventListener('input', (event) => {
    let searchInput = event.target.value.toLowerCase();
    let photos = Array.from(gallery.children);
    visiblePhoto = [];

    photos.forEach(photo => {
        let singlePhoto = photo.querySelector('img');
        let singlePhotoSource = singlePhoto.getAttribute('src');
        let singlePhotoName = singlePhoto.getAttribute('alt');

        if (!singlePhotoName.toLowerCase().includes(searchInput)) {
            photo.style.display = "none";
        } else {
            visiblePhoto.push(singlePhotoSource);
            photo.style = "";
        }
    });
});

function getImages() {
    return fetch('../images.json').then(response => {
        if (response.ok) {
            return response.json();
        }
        return null;
    }).then(result => {
        if (result != null) {
            result.images.forEach(img => {
                let thumbnail = document.createElement('img')
                thumbnail.src = img.url;
                thumbnail.alt = img.description;
                visiblePhoto.push(thumbnail.src);
                thumbnail.classList.add('thumbnail');

                let lightBox = document.createElement('a');
                lightBox.setAttribute("data-fslightbox", "gallery");
                lightBox.href = img.url;
                lightBox.addEventListener("click", () => openImage(thumbnail.src));
                lightBox.appendChild(thumbnail);

                gallery.appendChild(lightBox);
                refreshFsLightbox();
            })
        } else {
            console.error("response is empty");
        }
    });
}

function openImage(clickedImageSrc) {
    instance = fsLightboxInstances["gallery"];
    clicked = clickedImageSrc


    let toolbar;
    let btn;

    let intervalId;

    instance.props.onOpen = function () {
        toolbar = document.querySelector(".fslightbox-toolbar");

        btn = document.createElement("div");
        btn.id = "btn-slideshow";
        btn.classList.add("slideshow");
        btn.setAttribute("title", "Spusti prezentaciu");
        btn.addEventListener("click", changeSlideshow);
        btn.style = `width: 35px;
            height: 35px;
            top: 7px;
            right: 100px;
            color: white;
            position: absolute;
            background-image: url(../css/start.png);
            background-size: cover;
            cursor: pointer;
            filter: opacity(70%);
            transition: filter 250ms ease-out;`;

        var firstChild = toolbar.firstChild;
        toolbar.insertBefore(btn, firstChild);

        // Set the future displayed image when opening the lightbox
        calculateIndex(clickedImageSrc);
    }

    instance.props.onClose = function () {
        toolbar.removeChild(btn);
        clickedBtn = 0;
        clearInterval(intervalId);
    }

    function changeSlideshow() {
        btn.classList.toggle("full-opacity-filter");

        if (clickedBtn == 0) {
            clickedBtn = 1;
        } else {
            clickedBtn = 0;
        }
        console.log(clickedBtn);

        if (clickedBtn != 0) {
            intervalId = setInterval(changeImage, 3000);
        } else {
            clickedBtn = 0;
            clearInterval(intervalId);
        }
        console.log(clickedBtn);

        function changeImage() {
            const lightboxSources = document.querySelectorAll('.fslightbox-source');
            var displayedImage = lightboxSources[1]
            console.log("BEFORE START: " + displayedImage);
            console.log("BEFORE START: " + displayedImage.src);
            console.log("BEFORE START: " + displayedImage.id);

            console.log("START");
            console.log(currentImageIndex);
            console.log(visiblePhoto[currentImageIndex]);

            if (currentImageIndex < visiblePhoto.length - 1) {
                console.log("Changing image after 3 seconds");
                console.log("Before changing" + displayedImage.src);
                currentImageIndex++;
                console.log(currentImageIndex);
                displayedImage.src = visiblePhoto[currentImageIndex];
                console.log(" after changing " +displayedImage.src);
                console.log("NIECO");
                refreshFsLightbox();
            } else {
                currentImageIndex = 0;
                displayedImage.src = visiblePhoto[currentImageIndex];
                console.log(displayedImage.src);
                currentImageIndex++;
            }
        }
    }

    function calculateIndex(photoName) {
        visiblePhoto.forEach((image, index) => {
            if (image === photoName) {
                currentImageIndex = index;
            }
        });
        console.log(`Current index of foto: ${currentImageIndex}: ${photoName}`);
        console.log(visiblePhoto)
    }
}

getImages();
