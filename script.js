
// Function to fetch movies from the API
async function fetchMovies() {
    try {
      // Fetch movies from API
      const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1');
      const data = await response.json();
      return data.results; // Array of movies
    } catch (error) {
      console.error('Error fetching movies:', error);
      return []; // Return an empty array in case of an error
    }
  }
  
   // Sort movies by date (oldest to latest)    ....working
   function sortByDate() {
    const movieList = document.querySelector('.movie-list');
    const movies = Array.from(movieList.children);
  
    const sortedMovies = movies.sort((a, b) => {
      const titleA = a.querySelector('h3').textContent;
      const titleB = b.querySelector('h3').textContent;
      return titleA.localeCompare(titleB);
    });
  
    movieList.innerHTML = '';
    sortedMovies.forEach(movie => movieList.appendChild(movie));
  }
  
  // Sort movies by rating (least to most)   ....working
  function sortByRating() {
    const movieList = document.querySelector('.movie-list');
    const movies = Array.from(movieList.children);
  
    const sortedMovies = movies.sort((a, b) => {
      const voteA = parseFloat(a.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
      const voteB = parseFloat(b.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
      return voteA - voteB;
    });
  
    movieList.innerHTML = '';
    sortedMovies.forEach(movie => movieList.appendChild(movie));
  }

  
// Pagination variables    ....working
let currentPage = 1;
const moviesPerPage = 5; // Number of movies to display per page
let movies = []; // Array to hold all movies

// Function to display movies based on pagination
function displayMovies(movies) {
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const displayedMovies = movies.slice(startIndex, endIndex);
  renderMovieCards(displayedMovies);
  updatePaginationText();
}

// Show previous page
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayMovies(movies);
  }
}

// Show next page
function nextPage() {
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayMovies(movies);
  }
}

// Function to update pagination text
function updatePaginationText() {
  const currentPageElement = document.getElementById('currentPage');
  currentPageElement.textContent = `Page ${currentPage}`;
}

// Initialization
window.onload = async () => {
  movies = await fetchMovies();
  displayMovies(movies);
};

  
  // Search movies by name   ....working
  function searchMovies() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
  
    const movieList = document.querySelector('.movie-list');
    const movies = Array.from(movieList.children);
  
    movies.forEach(movie => {
      const title = movie.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        movie.style.display = 'block';
      } else {
        movie.style.display = 'none';
      }
    });
  }

 // Function to render movies in cards
 async function renderMovies() {
  const movies = await fetchMovies();
  const movieList = document.querySelector('.movie-list');
  movieList.innerHTML = ''; 

  movies.forEach(movie => {
    const { title, vote_count, vote_average, poster_path } = movie;

  //   Create movie card elements
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    const posterUrl = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://via.placeholder.com/150'; // Placeholder image if poster not available

    const isFavorite = isMovieInFavorites(title); // Check if movie is in favorites

    movieCard.innerHTML = `
      <img src="${posterUrl}" alt="${title} poster">
      <h3>${title}</h3>
      <p>Vote Count: ${vote_count}</p>
      <p>Vote Average: ${vote_average}</p>
      <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${title}')">${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
    `;

    movieList.appendChild(movieCard);
  });
}

function isMovieInFavorites(title) {
  const favorites = JSON.parse(localStorage.getItem('Favorites')) || [];
  return favorites.includes(title);
}

// Show all movies
function showAllMovies() {
  renderMovies();
}

  


// Function to render movie cards
function renderMovieCards(movies) {
  const movieList = document.querySelector('.movie-list');
  movieList.innerHTML = ''; // Clear movie list before rendering

  movies.forEach(movie => {
    const { title, vote_count, vote_average, poster_path } = movie;

    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    const posterUrl = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://via.placeholder.com/150';
    
    const isFavorite = isMovieInFavorites(title);

    movieCard.innerHTML = `
      <img src="${posterUrl}" alt="${title} poster">
      <h3>${title}</h3>
      <p>Vote Count: ${vote_count}</p>
      <p>Vote Average: ${vote_average}</p>
      <button class="favorite-btn" onclick="addToFavorites('${title}')">Add to Favorites</button>
      `;
//  <button class="favorite-btn" onclick="addToFavorites('${title}')">Add to Favorites</button> 
// <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${title}')">${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
      
    movieList.appendChild(movieCard);
  });
}
  

// // Initialization
// window.onload = async () => {
//   movies = await fetchMovies();
//   displayMovies(movies);
//   updatePaginationText();
// };


  // web page linking 
  document.querySelector('.logo').addEventListener('click', showAllMovies);     // working
  document.querySelector('.movie_deck').addEventListener('click', showAllMovies);  // working




// Function to show favorite movies  ....working
function addToFavorites(movieTitle) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);
  
  if (index === -1) {
    favorites.push({ title: movieTitle });
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } else {
    favorites.splice(index, 1); // Remove from favorites if already present
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // Update UI based on the tab currently active
  const isFavoritesTabActive = document.querySelector('.tabs button:nth-child(2)').classList.contains('active-tab');
  if (isFavoritesTabActive) {
    showFavoriteMovies();
  }
}

function showFavoriteMovies() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const filteredMovies = movies.filter(movie => favorites.some(fav => fav.title === movie.title));
  renderMovieCards(filteredMovies);
}




  // ============================================================================================
  function addToFavorites(movieTitle) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);

        if (index === -1) {
            favorites.push({ title: movieTitle });
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
  }


// // Connect "Previous" and "Next" buttons to navigate pages
// document.querySelector('.pagination button:first-child').addEventListener('click', previousPage);
// document.querySelector('.pagination button:last-child').addEventListener('click', nextPage);

// document.querySelector('.ab:first-child').addEventListener('click', previousPage);
// document.querySelector('.abc:last-child').addEventListener('click', nextPage);



  



//   document.querySelector('.abc').addEventListener('click', showAllMovies);
//   document.querySelector('.ab').addEventListener('click', showAllMovies);


// function addToFavorites(movieTitle) {
//   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//   const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);
//   if (index === -1) {
//       favorites.push({ title: movieTitle });
//       localStorage.setItem('favorites', JSON.stringify(favorites));
//   }
// }

// function showFavoriteMovies2(FavoriteMovies2){
// //   // Retrieve data from local storage
// // let data = localStorage.getItem('key') // Replace 'key' with the actual key used to store data
// // // Update UI with retrieved data
// // document.getElementById('elementId').value = data || ''; // Replace 'elementId' with the ID of the HTML element where you want to display the data
//   // Retrieve data from local storage
//   let FavoriteMovies2 = localStorage.getItem('movies'); // Replace 'myKey' with your specific key

//   // Update UI with retrieved data
//   document.getElementById('movieTitle').FavoriteMovies2 = movies || ''; // If data is null or undefined, set the field to empty string
// }
//==========================================================================================














// // Function to fetch movies from the API
// async function fetchMovies() {
//     try {
//       // Fetch movies from API
//       const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1');
//       const data = await response.json();
//       return data.results; // Array of movies
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//       return []; // Return an empty array in case of an error
//     }
//   }
  
//    // Sort movies by date (oldest to latest)    ....working
//    function sortByDate() {
//     const movieList = document.querySelector('.movie-list');
//     const movies = Array.from(movieList.children);
  
//     const sortedMovies = movies.sort((a, b) => {
//       const titleA = a.querySelector('h3').textContent;
//       const titleB = b.querySelector('h3').textContent;
//       return titleA.localeCompare(titleB);
//     });
  
//     movieList.innerHTML = '';
//     sortedMovies.forEach(movie => movieList.appendChild(movie));
//   }
  
//   // Sort movies by rating (least to most)   ....working
//   function sortByRating() {
//     const movieList = document.querySelector('.movie-list');
//     const movies = Array.from(movieList.children);
  
//     const sortedMovies = movies.sort((a, b) => {
//       const voteA = parseFloat(a.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
//       const voteB = parseFloat(b.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
//       return voteA - voteB;
//     });
  
//     movieList.innerHTML = '';
//     sortedMovies.forEach(movie => movieList.appendChild(movie));
//   }

  
// // Pagination variables    ....working
// let currentPage = 1;
// const moviesPerPage = 5; // Number of movies to display per page
// let movies = []; // Array to hold all movies

// // Function to display movies based on pagination
// function displayMovies(movies) {
//   const startIndex = (currentPage - 1) * moviesPerPage;
//   const endIndex = startIndex + moviesPerPage;
//   const displayedMovies = movies.slice(startIndex, endIndex);
//   renderMovieCards(displayedMovies);
//   updatePaginationText();
// }

// // Show previous page
// function previousPage() {
//   if (currentPage > 1) {
//     currentPage--;
//     displayMovies(movies);
//   }
// }

// // Show next page
// function nextPage() {
//   const totalPages = Math.ceil(movies.length / moviesPerPage);
//   if (currentPage < totalPages) {
//     currentPage++;
//     displayMovies(movies);
//   }
// }

// // Function to update pagination text
// function updatePaginationText() {
//   const currentPageElement = document.getElementById('currentPage');
//   currentPageElement.textContent = `Page ${currentPage}`;
// }

// // Initialization
// window.onload = async () => {
//   movies = await fetchMovies();
//   displayMovies(movies);
// };

  
//   // Search movies by name   ....working
//   function searchMovies() {
//     const searchInput = document.getElementById('searchInput');
//     const searchTerm = searchInput.value.toLowerCase().trim();
  
//     const movieList = document.querySelector('.movie-list');
//     const movies = Array.from(movieList.children);
  
//     movies.forEach(movie => {
//       const title = movie.querySelector('h3').textContent.toLowerCase();
//       if (title.includes(searchTerm)) {
//         movie.style.display = 'block';
//       } else {
//         movie.style.display = 'none';
//       }
//     });
//   }

//  // Function to render movies in cards
//  async function renderMovies() {
//   const movies = await fetchMovies();
//   const movieList = document.querySelector('.movie-list');
//   movieList.innerHTML = ''; 

//   movies.forEach(movie => {
//     const { title, vote_count, vote_average, poster_path } = movie;

//   //   Create movie card elements
//     const movieCard = document.createElement('div');
//     movieCard.classList.add('movie-card');
//     const posterUrl = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://via.placeholder.com/150'; // Placeholder image if poster not available

//     const isFavorite = isMovieInFavorites(title); // Check if movie is in favorites

//     movieCard.innerHTML = `
//       <img src="${posterUrl}" alt="${title} poster">
//       <h3>${title}</h3>
//       <p>Vote Count: ${vote_count}</p>
//       <p>Vote Average: ${vote_average}</p>
//       <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${title}')">${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
//     `;

//     movieList.appendChild(movieCard);
//   });
// }

// function isMovieInFavorites(title) {
//   const favorites = JSON.parse(localStorage.getItem('Favorites')) || [];
//   return favorites.includes(title);
// }

// // Show all movies
// function showAllMovies() {
//   renderMovies();
// }

  


// // Function to render movie cards
// function renderMovieCards(movies) {
//   const movieList = document.querySelector('.movie-list');
//   movieList.innerHTML = ''; // Clear movie list before rendering

//   movies.forEach(movie => {
//     const { title, vote_count, vote_average, poster_path } = movie;

//     const movieCard = document.createElement('div');
//     movieCard.classList.add('movie-card');
//     const posterUrl = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://via.placeholder.com/150';
    
//     const isFavorite = isMovieInFavorites(title);

//     movieCard.innerHTML = `
//       <img src="${posterUrl}" alt="${title} poster">
//       <h3>${title}</h3>
//       <p>Vote Count: ${vote_count}</p>
//       <p>Vote Average: ${vote_average}</p>
//       <button class="favorite-btn" onclick="addToFavorites('${title}')">Add to Favorites</button>
//       `;
// //  <button class="favorite-btn" onclick="addToFavorites('${title}')">Add to Favorites</button> 
// // <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${title}')">${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
      
//     movieList.appendChild(movieCard);
//   });
// }
  

// // // Initialization
// // window.onload = async () => {
// //   movies = await fetchMovies();
// //   displayMovies(movies);
// //   updatePaginationText();
// // };


//   // web page linking 
//   document.querySelector('.logo').addEventListener('click', showAllMovies);     // working
//   document.querySelector('.movie_deck').addEventListener('click', showAllMovies);  // working




// // Function to show favorite movies  ....working
// function addToFavorites(movieTitle) {
//   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//   const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);
  
//   if (index === -1) {
//     favorites.push({ title: movieTitle });
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   } else {
//     favorites.splice(index, 1); // Remove from favorites if already present
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   }

//   // Update UI based on the tab currently active
//   const isFavoritesTabActive = document.querySelector('.tabs button:nth-child(2)').classList.contains('active-tab');
//   if (isFavoritesTabActive) {
//     showFavoriteMovies();
//   }
// }

// function showFavoriteMovies() {
//   const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//   const filteredMovies = movies.filter(movie => favorites.some(fav => fav.title === movie.title));
//   renderMovieCards(filteredMovies);
// }




//   // ============================================================================================
//   function addToFavorites(movieTitle) {
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//     const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);

//         if (index === -1) {
//             favorites.push({ title: movieTitle });
//             localStorage.setItem('favorites', JSON.stringify(favorites));
//         }
//   }


// // // Connect "Previous" and "Next" buttons to navigate pages
// // document.querySelector('.pagination button:first-child').addEventListener('click', previousPage);
// // document.querySelector('.pagination button:last-child').addEventListener('click', nextPage);

// // document.querySelector('.ab:first-child').addEventListener('click', previousPage);
// // document.querySelector('.abc:last-child').addEventListener('click', nextPage);



  



// //   document.querySelector('.abc').addEventListener('click', showAllMovies);
// //   document.querySelector('.ab').addEventListener('click', showAllMovies);


// // function addToFavorites(movieTitle) {
// //   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// //   const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);
// //   if (index === -1) {
// //       favorites.push({ title: movieTitle });
// //       localStorage.setItem('favorites', JSON.stringify(favorites));
// //   }
// // }

// // function showFavoriteMovies2(FavoriteMovies2){
// // //   // Retrieve data from local storage
// // // let data = localStorage.getItem('key') // Replace 'key' with the actual key used to store data
// // // // Update UI with retrieved data
// // // document.getElementById('elementId').value = data || ''; // Replace 'elementId' with the ID of the HTML element where you want to display the data
// //   // Retrieve data from local storage
// //   let FavoriteMovies2 = localStorage.getItem('movies'); // Replace 'myKey' with your specific key

// //   // Update UI with retrieved data
// //   document.getElementById('movieTitle').FavoriteMovies2 = movies || ''; // If data is null or undefined, set the field to empty string
// // }
// //==========================================================================================


// // // Function to toggle adding/removing movies from favorites
// // function toggleFavorite(movieTitle) {
// //   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// //   const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);
  
// //   if (index === -1) {
// //     favorites.push({ title: movieTitle });
// //     localStorage.setItem('favorites', JSON.stringify(favorites));
// //   } else {
// //     favorites.splice(index, 1); // Remove from favorites if already present
// //     localStorage.setItem('favorites', JSON.stringify(favorites));
// //   }

// //   // Update UI based on the tab currently active
// //   const isFavoritesTabActive = document.querySelector('.tabs button:nth-child(2)').classList.contains('active-tab');
// //   if (isFavoritesTabActive) {
// //     showFavoriteMovies();
// //   }
// // }

// // // Function to render movie cards
// // function renderMovieCards(movies) {
// //   const movieList = document.querySelector('.movie-list');
// //   movieList.innerHTML = ''; // Clear movie list before rendering

// //   movies.forEach(movie => {
// //     const { title, vote_count, vote_average, poster_path } = movie;

// //     const movieCard = document.createElement('div');
// //     movieCard.classList.add('movie-card');
// //     const posterUrl = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : 'https://via.placeholder.com/150';
    
// //     const isFavorite = isMovieInFavorites(title);

// //     movieCard.innerHTML = `
// //       <img src="${posterUrl}" alt="${title} poster">
// //       <h3>${title}</h3>
// //       <p>Vote Count: ${vote_count}</p>
// //       <p>Vote Average: ${vote_average}</p>
// //       <button class="favorite-btn" onclick="toggleFavorite('${title}')">${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
// //     `;
      
// //     movieList.appendChild(movieCard);
// //   });
// // }

// // function addToFavorites(movieTitle) {
// //   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// //   const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);

// //   if (index === -1) {
// //     favorites.push({ title: movieTitle });
// //     localStorage.setItem('favorites', JSON.stringify(favorites));
// //   } else {
// //     favorites.splice(index, 1); // Remove from favorites if already present
// //     localStorage.setItem('favorites', JSON.stringify(favorites));
// //     // Update UI based on the tab currently active
// //     const isFavoritesTabActive = document.querySelector('.tabs button:nth-child(2)').classList.contains('active-tab');
// //     if (isFavoritesTabActive) {
// //       showFavoriteMovies();
// //     }
// //   }
// // }

// // function showFavoriteMovies() {
// //   const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// //   const filteredMovies = movies.filter(movie => favorites.some(fav => fav.title === movie.title));
// //   renderMovieCards(filteredMovies);
// // }

// function addToFavorites(movieTitle) {
//   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//   const index = favorites.findIndex(favMovie => favMovie.title === movieTitle);

//   if (index === -1) {
//     favorites.push({ title: movieTitle });
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   } else {
//     favorites.splice(index, 1); // Remove from favorites if already present
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   }

//   // Update UI based on the tab currently active
//   const isFavoritesTabActive = document.querySelector('.tabs button:nth-child(2)').classList.contains('active-tab');
//   if (isFavoritesTabActive) {
//     showFavoriteMovies();
//   }
// }

// function showFavoriteMovies() {
//   const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//   const filteredMovies = movies.filter(movie => favorites.some(fav => fav.title === movie.title));
//   renderMovieCards(filteredMovies);
// }

// function renderMovieCards(movies) {
//   // Existing rendering logic for movie cards

//   // Adding "Remove from Favorites" button alongside "Add to Favorites"
//   movieCard.innerHTML = `
//     <img src="${posterUrl}" alt="${title} poster">
//     <h3>${title}</h3>
//     <p>Vote Count: ${vote_count}</p>
//     <p>Vote Average: ${vote_average}</p>
//     <button class="favorite-btn" onclick="addToFavorites('${title}')">
//       ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//     </button>
//   `;
//   // Additional button to remove from favorites
//   const removeFavoriteBtn = document.createElement('button');
//   removeFavoriteBtn.classList.add('favorite-btn');
//   removeFavoriteBtn.textContent = 'Remove from Favorites';
//   removeFavoriteBtn.onclick = function() {
//     addToFavorites(title); // Toggle the favorite status
//   };
//   movieCard.appendChild(removeFavoriteBtn);

//   // Append the movie card to the list
//   movieList.appendChild(movieCard);
// }
