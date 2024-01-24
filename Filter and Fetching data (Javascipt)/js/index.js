

// Fetch album data and render on page load
const albumStore = []; 

async function fetchingAlbum() {

    const res = await fetch('data/albums.json'); 
    const data = await res.json();
    albumStore.push(...data); // Make a copy using the spread operator
    renderAlbums(data);

}

//  Add submit event to the form
const form = document.getElementById('album-search-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  // Get search query and minimum rating values
  const searchInput = document.getElementById('search-input').value.trim();
  const ratingInput = parseFloat(document.getElementById('min-album-rating-input').value) || 0;
  // Perform search
  const searchResults = performSearch(searchInput, ratingInput);
  // sorting the data
  if (searchResults){
    searchResults.sort((a, b) => b.averageRating - a.averageRating);
  }
   
  // Render the search results
  renderAlbums(searchResults);

});

// Search function
function performSearch(searchInput, ratingInput) {
  const results = albumStore.filter((album) => {
    const artistMatch = album.artistName.toLowerCase().includes(searchInput.toLowerCase());
    const albumNameMatch = album.album.toLowerCase().includes(searchInput.toLowerCase());
    const ratingMatch = album.averageRating >= ratingInput;
    return (artistMatch ||albumNameMatch) && ratingMatch;
  });

  return results.length > 0 ? results : null;
}

// Render function
function renderAlbums(albums) {
  const albumRender = document.getElementById('album-rows');
  albumRender.innerHTML = '';
  if (albums) {
    albums.forEach((album) => {
      const data = document.createElement('tr');
      data.innerHTML = `
      <td>${album.album}</td>
      <td>${album.releaseDate}</td>
      <td>${album.artistName}</td>
      <td>${album.genres}</td>
      <td>${album.averageRating}</td>
      <td>${album.numberReviews}</td>
      `;
      albumRender.appendChild(data);
    });
  } else {
    // Display a message when no results are found
    const errorMessage  = document.createElement('tr'); 
    errorMessage.innerHTML = '<td colspan="6">No results found</td>';
    albumRender.appendChild(errorMessage);
  }
}
fetchingAlbum()

