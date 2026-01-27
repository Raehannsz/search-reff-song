const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const toggleDarkBtn = document.getElementById('toggle-dark');

// Toggle dark mode
toggleDarkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.querySelector('header').classList.toggle('dark');
});

// Load history dari localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Event search
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) return;

  // Simpan ke history
  searchHistory.push(query);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  fetchSongs(query);
});

// Function untuk fetch lagu dari iTunes API
async function fetchSongs(query) {
  resultsDiv.innerHTML = '';
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`
    );

    const data = await response.json();
    loadingDiv.classList.add('hidden');

    if (data.results.length > 0) {
      displayResults(data.results);
    } else {
      resultsDiv.innerHTML = '<p>Lagu tidak ditemukan.</p>';
    }
  } catch (error) {
    loadingDiv.classList.add('hidden');
    console.error(error);
    resultsDiv.innerHTML = '<p>Terjadi kesalahan, coba lagi.</p>';
  }
}

// Function untuk menampilkan hasil pencarian
function displayResults(songs) {
  resultsDiv.innerHTML = songs
    .map(
      (song) => `
    <div class="result-item">
      <img src="${song.artworkUrl100.replace('100x100', '200x200')}" alt="Cover Art">
      <h3>${song.trackName}</h3>
      <p>${song.artistName}</p>
      <p><em>${song.collectionName}</em></p>
      <audio controls src="${song.previewUrl}"></audio>
      <a href="${song.trackViewUrl}" target="_blank">Dengar di Apple Music</a>
    </div>
  `
    )
    .join('');
}