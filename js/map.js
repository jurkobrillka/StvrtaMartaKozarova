let gallery = document.getElementById("gallery");
let filter = document.getElementById("filter");
let imgsArray;
let visiblePhoto = [];
console.log("MAPA starting");
let currentImageIndex = 0;
let clicked;
let markers = [];
let imgsFiltered = [];
let imagesPhotos = [];
const toggleButton = document.getElementById("toggleButton");
const toggleStatus = document.getElementById("toggleStatus");
toggleButton.addEventListener("click", toggleHandler);

function toggleHandler() {
    // Check the state of the button
    if (toggleButton.checked) {
        createNavigator(1)
    } else {
        createNavigator(0)
    }
}


let map = L.map('map');
map = map.setView([53.077340, 8.809623], 6);

const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    minZoom: 2,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
}).addTo(map);

function getImages() {
    return fetch('../images.json').then(response => {
        if (response.ok) {
            return response.json();
        }
        return null;
    }).then(result => {
        if (result != null) {
            var i=0
            result.images.forEach(img => {
                /*if (i>=result.images.length/2){
                    //photo.style.display = "none";
                    return;
                }*/
                i++
                imagesPhotos.push(img)
                let thumbnail = document.createElement('img')
                thumbnail.src = img.url;
                thumbnail.alt = img.description;
                console.log(thumbnail.src)
                visiblePhoto.push(thumbnail.src);
                thumbnail.classList.add('thumbnail');

                let lightBox = document.createElement('a');
                lightBox.setAttribute("data-fslightbox", "gallery");
                lightBox.href = img.url;
                lightBox.addEventListener("click", () => openImage(thumbnail.src));
                lightBox.appendChild(thumbnail);

                gallery.appendChild(lightBox);
                refreshFsLightbox();
            });

            createNavigator(0);

        } else {
            console.error("response is empty");
        }
    });
}

map.on('click',mapWakedUp);

function mapWakedUp(){
    console.log("ZOBUDZAM MAOU")
    imagesPhotos = [];
    visiblePhoto = [];
    var galleryss = document.getElementById("gallery");
    galleryss.remove();
    gallery = document.createElement("div");
    gallery.id = "gallery";
    gallery.style.margin = "2rem";
    gallery.style.padding = "2rem";

    // Append the recreated gallery element to the body or another parent element
    document.body.appendChild(gallery);
    gallery = document.getElementById("gallery");
    getImages().then("SUCCESFULLY RECREATED MAP")

}

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
/*
getImages().then(() => {
    console.log(imagesPhotos)
    console.log("DUPLIKATY IMAGES POTOS")
    imagesPhotos = makeUniqueArray(imagesPhotos);
    console.log(imagesPhotos)
    console.log("UZ NIE DUPLIKATY IMAGES POTOS")
})*/




//NEW
function insertPoint(place) {
    console.log(place + "hihi")
    let marker = L.marker([place.coordinates.latitude, place.coordinates.longitude]).addTo(map);
    marker.bindPopup("<b>" + place.name + "</b><br>"
        + place.description + "<br>"
        + place.date + "<br>"
        /*+ place.timestamp.time*/);
    markers.push(marker);

    marker.on('click', function (e) {
        imgsFiltered = findPlacesByGps(place);
        imgsFiltered = makeUniqueArray(imgsFiltered);
        console.log(imgsFiltered)
        updateImages(imgsFiltered);
    });
}

function updateImages(photos){
    console.log("UPDATING GALERIU")
    let photosEles = Array.from(gallery.children);
    console.log(photosEles)
    console.log(photos)
    var i = 0
    photosEles.forEach(photo => {

        i++;
        let singlePhoto = photo.querySelector('img');
        let singlePhotoDesc = singlePhoto.getAttribute('alt');
        photo.style = "";

        console.log(singlePhotoDesc)
        if (!photos.includes(singlePhotoDesc)) {
            photo.style.display = "none";
            console.log("RUSIM")
            console.log(singlePhotoDesc)
        } else {
            //visiblePhoto.push(singlePhotoSource);
            photo.style = "";
            console.log("NECHAVAM" + singlePhotoDesc)
        }
    });
}

async function addMarkers() {
    await getImages();
    console.log("ADDING MARKERS")
    console.log(imagesPhotos)
    console.log("BEFORE")
    imagesPhotos = makeUniqueArray(imagesPhotos);
    console.log(imagesPhotos)
    console.log("AFTER")
    imagesPhotos.forEach(place => {
        console.log(place.date)
        console.log("IN FOR")
        insertPoint(place);
    });

}

function findPlacesByGps(placeToFind) {
    console.log("FINDING PLACES BY GPS")
    // Using Array.find to search for a place by object equality
    let arrToRet = [];
    imagesPhotos.forEach(place => {
        console.log(place.coordinates.latitude)
        console.log(place.coordinates.longitude)
        if (place.coordinates.latitude === placeToFind.coordinates.latitude &&
            place.coordinates.longitude === placeToFind.coordinates.longitude)
        {
            arrToRet.push(place.description);
        }
    });
    return arrToRet;
}

function makeUniqueArray(array) {
    console.log("MAKING I UNIQUE")
    const uniqueSet = new Set(array.map(item => JSON.stringify(item)));
    return Array.from(uniqueSet, item => JSON.parse(item));
}

addMarkers().then(console.log(imagesPhotos))


const compareDates = (a, b) => {
    const dateComparison = new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
    if (dateComparison === 0) {
        return new Date('1970-01-01 ' + a.time) - new Date('1970-01-01 ' + b.time);
    }
    return dateComparison;
};

const sortedData = imagesPhotos.sort(compareDates);

console.log(sortedData);

let routingControl;

/*
function createNavigator(visible) {
    var latLngArr = [];

    // Assuming imagesPhotos is an array of objects with 'coordinates' property
    if (visible !== 0) {
        imagesPhotos.forEach(place => {
            latLngArr.push(L.latLng(place.coordinates.latitude, place.coordinates.longitude));
        });
    }

    console.log(latLngArr);
    console.log("LATLONGARRAYKO");

    console.log(imagesPhotos[0].coordinates.latitude + "POZOR POZOR");

    // Assuming 'map' is a valid Leaflet map object
    routingControl = L.Routing.control({
        waypoints: latLngArr,
        routeWhileDragging: true
    }).addTo(map);

    if(visible === 0){
        console.log("MAL BY SOM ZRUSIL TU GPS MAPU")

    }
}*/
function createNavigator(visible) {
    let indexDeleting;
    var latLngArr = [];

    // Assuming imagesPhotos is an array of objects with 'coordinates' property
    if (visible !== 0) {
        imagesPhotos.forEach(place => {
            latLngArr.push(L.latLng(place.coordinates.latitude, place.coordinates.longitude));
        });

        routingControl = L.Routing.control({
            waypoints: latLngArr,
            routeWhileDragging: true
        }).addTo(map);

        routingControl.on('routesfound', function (event) {
            let routes = event.routes;
            let totalDistance = routes.reduce((sum, route) => sum + route.summary.totalDistance, 0);
            toggleStatus.textContent = "Celková vzdialenosť: " + (totalDistance / 1000).toFixed(2) + " kilometers";
        });
    }

    console.log(latLngArr);
    console.log("LATLONGARRAYKO");

    console.log(imagesPhotos[0].coordinates.latitude + "POZOR POZOR");

    // Check if routingControl exists, and remove it if visible is 0
    if (routingControl && visible === 0) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    // Clear the map's layers if visible is 0
    if (visible === 0) {
        toggleStatus.textContent = "";
        map.eachLayer(layer => {
            if (layer !== tiles) {
                map.removeLayer(layer);
            }
        });
        let routingContainer = document.querySelector('.leaflet-routing-container');

        console.log("DISPLAYING NONE");
        console.log(routingContainer)
// Check if the element exists before manipulating its style
        if (routingContainer) {
            console.log("DISPLAYING NONE");
            routingContainer.style.display = 'none';
        }

        console.log("ADDING MARKERS")
        console.log(imagesPhotos)
        console.log("BEFORE")
        imagesPhotos = makeUniqueArray(imagesPhotos);
        console.log(imagesPhotos)
        console.log("AFTER")
        imagesPhotos.forEach(place => {
            console.log(place.date)
            console.log("IN FOR")
            insertPoint(place);
        });
    }

    // Assuming 'map' is a valid Leaflet map object


    if (visible === 0) {
        console.log("MAL BY SOM ZRUSIL TU GPS MAPU");
    }
}

