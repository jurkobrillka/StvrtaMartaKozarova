console.log("loaded");

let gallery = document.getElementById("gallery");
let filter = document.getElementById("filter");

filter.addEventListener('input', (event) => {
    let searchInput = event.target.value.toLowerCase();
    let photos = Array.from(gallery.children);

    photos.forEach(photo => {
        if (!photo.alt.toLowerCase().includes(searchInput)) {
            // fotku skry
            // aplikujem triedu
            photo.style.display = "none";// pridam inline style

        } else {
            photo.style = ""; // vymaz inline styl
        }
    })
})

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
                thumbnail.classList.add('thumbnail');

                gallery.appendChild(thumbnail);
            })
        } else {
            console.error("response is empty");
        }
    })
}

getImages();