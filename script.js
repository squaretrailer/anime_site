// ============================================
// SLIDESHOW
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

function changeSlide(n) { showSlide(slideIndex += n); }
function currentSlide(n) { showSlide(slideIndex = n); }

// ============================================
// ANIME CRUD
// ============================================
let animeList = [
    { id: 1, title: "One Piece", description: "A pirate adventure in the Grand Line.", image: "images/one_piece.webp" },
    { id: 2, title: "Bleach", description: "A shinigami's quest to become a hero.", image: "images/bleach.jpg" },
    { id: 3, title: "Black Clover", description: "A boy who wants to become the wizard king.", image: "images/black_clover.webp" },
    { id: 4, title: "Hajime no Ippo", description: "A boy who wants to become a pro in boxing.", image: "images/hippo_no_hajime.jpg" },
    { id: 5, title: "Horimiya", description: "A boy who sees nothing in himself then falls in love.", image: "images/horimya.jpg" },
    { id: 6, title: "GTO", description: "A man who wants to become a great teacher.", image: "images/gto.jpg" },
    { id: 7, title: "MHA", description: "A boy who wants to become the greatest superhero.", image: "images/mha.jpeg" },
    { id: 8, title: "86", description: "A man who wants to become a great teacher.", image: "images/86.avif" },
    { id: 9, title: "Devil May Cry", description: "A man who is born as a half-human and half-devil.", image: "images/devil_may_cry.webp" }
];
let nextId = 7;

function handleImageError(img) {
    if (img.getAttribute('data-error')) return;
    img.setAttribute('data-error', 'true');
    img.src = 'images/placeholder.jpg';
    img.onerror = () => { img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"%3E%3Ctext x="4" y="16" fill="white"%3E?%3C/text%3E%3C/svg%3E'; };
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m] || m));
}

function renderAnimeCards() {
    const grid = document.getElementById('animeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'other-anime';
        const img = document.createElement('img');
        img.src = anime.image;
        img.alt = anime.title;
        img.onerror = function() { handleImageError(this); };
        const info = document.createElement('div');
        info.className = 'other-anime-info';
        info.innerHTML = `<h3>${escapeHtml(anime.title)}</h3><p>${escapeHtml(anime.description)}</p><div class="card-buttons"><button class="edit-btn" data-id="${anime.id}">✏️ Edit</button><button class="delete-btn" data-id="${anime.id}">🗑️ Delete</button></div>`;
        card.appendChild(img);
        card.appendChild(info);
        grid.appendChild(card);
    });
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => editAnime(parseInt(btn.dataset.id))));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteAnime(parseInt(btn.dataset.id))));
}

function addAnime() {
    let title = prompt("Enter anime title:");
    if (!title) return;
    let description = prompt("Enter short description:");
    if (!description) return;
    let image = prompt("Enter image path (e.g., images/yourimage.jpg):", "images/placeholder.jpg") || "images/placeholder.jpg";
    animeList.push({ id: nextId++, title, description, image });
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
// EXTERNAL SEARCH
// ============================================
async function searchAnime() {
    const query = document.getElementById('searchQuery').value.trim();
    const resultsDiv = document.getElementById('searchResults');
    if (!query) { resultsDiv.innerHTML = '<p>Please enter an anime name.</p>'; return; }
    resultsDiv.innerHTML = '<p>Searching...</p>';
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=12`);
        const data = await res.json();
        if (data.data && data.data.length) {
            resultsDiv.innerHTML = '';
            data.data.forEach(anime => {
                const card = document.createElement('div');
                card.className = 'search-result-card';
                card.innerHTML = `<img src="${anime.images.jpg.image_url}" alt="${anime.title}"><div class="info"><h4>${escapeHtml(anime.title)}</h4><p>${anime.synopsis ? escapeHtml(anime.synopsis.substring(0, 100)) + '...' : 'No synopsis'}</p></div>`;
                resultsDiv.appendChild(card);
            });
        } else { resultsDiv.innerHTML = '<p>No results found.</p>'; }
    } catch (err) { resultsDiv.innerHTML = '<p>Error fetching data. Try again later.</p>'; console.error(err); }
}

// ============================================
// BACK TO TOP (DIRECT FIX)
// ============================================
function setupBackToTop() {
    const btn = document.querySelector('footer button');
    if (btn) {
        btn.onclick = function(e) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        console.log('Back to Top button attached');
    } else {
        console.error('Back button not found');
    }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    showSlide(slideIndex);
    renderAnimeCards();
    setupBackToTop();
    document.getElementById('addAnimeBtn').addEventListener('click', addAnime);
    const searchBtn = document.getElementById('doSearch');
    const searchInput = document.getElementById('searchQuery');
    if (searchBtn) searchBtn.addEventListener('click', searchAnime);
    if (searchInput) searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') searchAnime(); });
});