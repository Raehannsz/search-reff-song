const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const toggleDarkBtn = document.getElementById('toggle-dark');

// Toggle dark mode di seluruh halaman
toggleDarkBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');

  if (document.documentElement.classList.contains('dark')) {
    toggleDarkBtn.textContent = '☀️ Light';
  } else {
    toggleDarkBtn.textContent = '🌙 Dark';
  }
});

// Load history dari localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Event search
function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  // Simpan ke history
  searchHistory.push(query);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  fetchSongs(query);
};

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
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
    <div class="flex-1 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-900
                 outline-none
                 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.7)]
                 dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]
                 focus:ring-2 focus:ring-indigo-400 transition-all duration-300">
      <img src="${song.artworkUrl100.replace('100x100', '200x200')}" alt="Cover Art">
      <h3>${song.trackName}</h3>
      <p>${song.artistName}</p>
      <p><em>${song.collectionName}</em></p>
      <div class="mt-2"><audio controls src="${song.previewUrl}" class="w-full" ></audio> </div>
      <a href="${song.trackViewUrl}" target="_blank">Dengar di Apple Music</a>
    </div>
  `
    )
    .join('');
}