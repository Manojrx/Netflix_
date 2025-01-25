

// Call the main functions the page is loaded
window.onload = () => {
  getOriginals()
  getTrendingNow()
  getTopRated()
}
// ** Function that fetches Netflix Originals **
function getOriginals() {
  var URL = 'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213';
  fetchMovies(URL, '.original__movies', 'poster_path')
}
// ** Function that fetches Trending Movies **
function getTrendingNow() {
  var URL =
    'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'
  fetchMovies(URL, '#trending', 'backdrop_path')
}
// ** Function that fetches Top Rated Movies **
function getTopRated() {
  var URL =
    'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'
  fetchMovies(URL, '#top_rated', 'backdrop_path')
}

// ** Helper function that makes dynamic API calls **
function fetchMovies(url, dom_element, path_type) {
  // Use Fetch with the url passed down 
  fetch(url).then(response => {
    if (response) {
      return response.json()
    }
  }).then(data => {
    showMovies(data, dom_element, path_type)
  })
  // Within Fetch get the response and call showMovies() with the data , dom_element, and path type
}

//  ** Function that displays the movies to the DOM **
showMovies = (movies, dom_element, path_type) => {

  // Create a variable that grabs id or class
  let orignal_movies = document.querySelector(dom_element);
  // Loop through object
  for (let movie of movies.results) {
    // Within loop create an img element
    var imageElement = document.createElement('img');
    // Set attribute
    imageElement.setAttribute("data-id", movie.id);
    // Set source
    imageElement.src = `${`https://image.tmdb.org/t/p/original`}${movie[path_type]}`

    imageElement.addEventListener('click', e => {
      handleMovieSelection(e)
    })
    // Append the imageElement to the dom_element selected
    orignal_movies.appendChild(imageElement)
  }
}



// ** BONUS **

const handleMovieSelection = e => {
  const id = e.target.getAttribute('data-id')
  getMovieTrailer(id).then(data => {
    const results = data.results
    const youtubeTrailers = results.filter(result => {
      if (result.site == 'YouTube' && result.type == 'Trailer') {
        return true
      } else {
        return false
      }
    })
    setTrailer(youtubeTrailers)
  })
  $('#trailerModal').modal('show')
}


async function getMovieTrailer(id) {
  var URL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
  return await fetch(URL).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      console.error("no response")
    }
  })
}

// ** Function that adds movie data to the DOM
const setTrailer = trailers => {
  const iframe = document.getElementById('movieTrailer')
  const movieNotFound = document.querySelector('.movieNotFound')


  //   // If there is a trailer add the src for it
  if (trailers.length > 0) {
    movieNotFound.classList.add('d-none')
    iframe.classList.remove('d-none')
    iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`
  } else {
    iframe.classList.add('d-none')
    movieNotFound.classList.remove('d-none')
  }
}





