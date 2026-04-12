// ============================================
// SLIDESHOW FUNCTIONS
// ============================================
let slideIndex = 1;

function showSlide(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (!slides.length) return;
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
    for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");
    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
}

function changeSlide(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

// ============================================
// ANIME COLLECTION – CRUD (local array)
// ============================================
let animeList = [
    { id: 1, title: "One Piece", description: "A pirate adventure in the Grand Line.", image: "images/one_piece.webp" },
    { id: 2, title: "Bleach", description: "A shinigami's quest to become a hero.", image: "images/bleach.jpg" },
    { id: 3, title: "Black Clover", description: "A boy who wants to become the wizard king.", image: "images/black_clover.webp" },
    { id: 4, title: "Hajime no Ippo", description: "A boy who wants to become a pro in boxing.", image: "images/hippo_no_hajime.jpg" },
    { id: 5, title: "Horimiya", description: "A boy who sees nothing in himself then falls in love.", image: "images/horimya.jpg" },
    { id: 6, title: "GTO", description: "A man who wants to become a great teacher.", image: "images/gto.jpg" }
];
let nextId = 7;

function renderAnimeCards() {
    const grid = document.getElementById('animeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'other-anime';
        card.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <div class="other-anime-info">
                <h3>${anime.title}</h3>
                <p>${anime.description}</p>
                <div class="card-buttons">
                    <button class="edit-btn" data-id="${anime.id}">✏️ Edit</button>
                    <button class="delete-btn" data-id="${anime.id}">🗑️ Delete</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editAnime(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteAnime(parseInt(btn.dataset.id)));
    });
}

function addAnime() {
    let title = prompt("Enter anime title:");
    if (!title) return;
    let description = prompt("Enter short description:");
    if (!description) return;
    let image = prompt("Enter image path (e.g., images/yourimage.jpg):", "images/placeholder.jpg");
    const newAnime = { id: nextId++, title, description, image: image || "images/placeholder.jpg" };
    animeList.push(newAnime);
    renderAnimeCards();
}

function editAnime(id) {
    const anime = animeList.find(a => a.id === id);
    if (!anime) return;
    let newTitle = prompt("Edit title:", anime.title);
    if (newTitle) anime.title = newTitle;
    let newDesc = prompt("Edit description:", anime.description);
    if (newDesc) anime.description = newDesc;
    let newImage = prompt("Edit image path:", anime.image);
    if (newImage) anime.image = newImage;
    renderAnimeCards();
}

function deleteAnime(id) {
    if (confirm("Delete this anime?")) {
        animeList = animeList.filter(a => a.id !== id);
        renderAnimeCards();
    }
}

// ============================================
// EXTERNAL SEARCH (Jikan API) – from navbar
// ============================================
async function searchAnimeFromNav() {
    const query = document.getElementById('navSearchInput').value.trim();
    const resultsDiv = document.getElementById('searchResults');
    if (!query) {
        resultsDiv.innerHTML = '<p>Please enter an anime name.</p>';
        return;
    }
    resultsDiv.innerHTML = '<p>Searching...</p>';
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`);
        const data = await res.json();
        if (data.data && data.data.length) {
            resultsDiv.innerHTML = '';
            data.data.forEach(anime => {
                const card = document.createElement('div');
                card.className = 'search-result-card';
                card.innerHTML = `
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    <div class="info">
                        <h4>${anime.title}</h4>
                        <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No synopsis'}</p>
                    </div>
                `;
                resultsDiv.appendChild(card);
            });
        } else {
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    } catch (err) {
        resultsDiv.innerHTML = '<p>Error fetching data. Try again later.</p>';
        console.error(err);
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Slideshow
    showSlide(slideIndex);
    // Anime cards
    renderAnimeCards();
    // Add button
    document.getElementById('addAnimeBtn').addEventListener('click', addAnime);
    // Navbar search events
    const navSearchBtn = document.getElementById('navSearchBtn');
    const navSearchInput = document.getElementById('navSearchInput');
    if (navSearchBtn && navSearchInput) {
        navSearchBtn.addEventListener('click', searchAnimeFromNav);
        navSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchAnimeFromNav();
        });
    }
});