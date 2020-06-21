// Inicialization
const paginator = function () { //paginator function
    let start = 1
    function next(str) {
        if (str == '+') return ++start
        else if (str == '-') return --start
        else return start
    }
    return next
}
let pageId //paginator instance
let searchItem //search item
const apiKey = '2ddeab55' //api key
$(document).ready(()=>{
    $('.movies').hide()
})


// Initial implementation of function search (without Promises):
// function search() {
//     searchItem = $('#input').val()
//     $('#searchTitle').text(`Search results for ${searchItem}:`)
//     $('.movies').html(``)
//     pageId = paginator()
//     xhr = new XMLHttpRequest() //Initialize http request
//     xhr.open('GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId()}`) //open http request
//     xhr.send() //send request
//     xhr.onreadystatechange = function () { //wait successful data retrieve
//         if (xhr.readyState === 4)
//             if (xhr.status === 200) {
//                 let moviesArray = JSON.parse(xhr.response).Search //storage array to load list of movies from OMdb
//                 for (let m of moviesArray) addMovie(m)
//                 $('.current').text(`Page: ${pageId()}`)
//                 $('.paginator').css('display', 'flex');
//                 $('.prev').hide()
//             }
//     } 
// }

// Search and load movies list from OMdb
function search() {
    searchItem = $('#input').val()
    $('#searchTitle').text(`Search results for ${searchItem}:`)
    $('#errorPlaceholder').hide()
    $('.movies').html(``)
    $('.movies').hide()
    $('.paginator').css('display', 'none');
    $('.prev').hide()
    pageId = paginator()
    let xhr = new XMLHttpRequest() //Initialize http request
    sendXHRRequest(xhr, 'GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId()}`)
        .then(response => getMovieList(response))
        .then(movieList => loadMovies(movieList))
        .catch(error => displayError(error))
    $('.movies').fadeIn()
}

function sendXHRRequest (xhr, method, url) {
    return new Promise((resolve, reject)=>{
        xhr.open(method, url) //open http request
        xhr.send()
        xhr.onload = function() {
            JSON.parse(xhr.response).Response == "True"
                ? resolve(JSON.parse(xhr.response))
                : reject(JSON.parse(xhr.response).Error)
        }
    })
}

function getMovieList(response) { // get movie list from response
    return new Promise((resolve, reject)=>{
        resolve(response.Search)
    })
}

function loadMovies(moviesList) { // load movies on page
    for (let m of moviesList) addMovie(m)
    $('.current').text(`Page: ${pageId()}`)
    $('.paginator').css('display', 'flex');
}

async function addMovie(movie) {// Add single html movie item on page
    let item = `<div class="movie">`
    item += `<img src=${movie.Poster}></img>`
    item += `<h2>${movie.Title}</h2>`
    item += `<p>${movie.Type}</p>`
    item += `<p>${movie.Year}</p>`
    item += `<button class="more" value="${movie.imdbID}" onclick="details()">More details</button>`
    item += `</div>`
    $('.movies').append(item)
}

// Display error
function displayError(error) {
    $('#errorPlaceholder').text(error)
    $('#errorPlaceholder').show()
}

// Initial implementation of function Details (without Promises):
// function details() { // Old way implementation
//     let movieId = $(event.target).val()
//     let xhr = new XMLHttpRequest()
//     xhr.open('GET', `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
//     xhr.send()
//     xhr.onreadystatechange = function() {
//         if(xhr.readyState === 4)
//             if (xhr.status === 200) {
//                 let movieData = JSON.parse(xhr.response)
//                 let movieRaits = movieData.Ratings
//                 let rateTable = `<table>`
//                 for (let item of movieRaits) {
//                     rateTable += `<tr><td>${item.Source}</td><td>${item.Value}</td></tr>`
//                 }
//                 rateTable += `</table>`
//                 $('.poster').html(`<img src="${movieData.Poster}"></img>`)
//                 $('.movieTitle').text(movieData.Title)
//                 $('.genre').text(movieData.Genre)
//                 $('.plot').text(movieData.Plot)
//                 $('.writer').html(`<span>Written by:</span> ${movieData.Writer}`)
//                 $('.director').html(`<span>Directed by:</span> ${movieData.Director}`)
//                 $('.starring').html(`<span>Starring:</span> ${movieData.Actors}`)
//                 $('.boxOffice').html(`<span>BoxOffice:</span> ${movieData.BoxOffice}`)
//                 $('.awards').html(`<span>Awards:</span> ${movieData.Awards}`)
//                 $('.ratings').html(rateTable)
//             }
//     }
//     $('#detailsModal').modal()
// }

// Load Details page for selected movie
function details() { // Open modal window with movie-details
    let movieId = $(event.target).val()
    let xhr = new XMLHttpRequest() //Initialize http request
    sendXHRRequest(xhr, 'GET', `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
        .then(response => loadMovieDetails(response))
        .then($('#detailsModal').modal())
        .catch(error => displayError(error))
}

function loadMovieDetails(movieData) { // get single movie details and put them on modal window
    let movieRaits = movieData.Ratings
    let rateTable = `<table>`
    for (let item of movieRaits) {
        rateTable += `<tr><td>${item.Source}</td><td>${item.Value}</td></tr>`
    }
    rateTable += `</table>`
    $('.poster').html(`<img src="${movieData.Poster}"></img>`)
    $('.movieTitle').text(movieData.Title)
    $('.genre').text(movieData.Genre)
    $('.plot').text(movieData.Plot)
    $('.writer').html(`<span>Written by:</span> ${movieData.Writer}`)
    $('.director').html(`<span>Directed by:</span> ${movieData.Director}`)
    $('.starring').html(`<span>Starring:</span> ${movieData.Actors}`)
    $('.boxOffice').html(`<span>BoxOffice:</span> ${movieData.BoxOffice}`)
    $('.awards').html(`<span>Awards:</span> ${movieData.Awards}`)
    $('.ratings').html(rateTable)
}

// Paginator
function prevPage() {
    $('.movies').html(``)
    $('.movies').hide()
    let xhr = new XMLHttpRequest()
    sendXHRRequest(xhr, 'GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId('-')}`)
        .then(response => getMovieList(response))
        .then(movieList => loadMovies(movieList))
        .catch(error => displayError(error))
        $('.movies').fadeIn()
    if (pageId()==1) $('.prev').hide()
    $('.current').text(`Page: ${pageId()}`)
}

function nextPage() {
    $('.movies').html(``)
    $('.movies').hide()
    $('.prev').show()
    let xhr = new XMLHttpRequest()
    sendXHRRequest(xhr, 'GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId('+')}`)
        .then(response => getMovieList(response))
        .then(movieList => loadMovies(movieList))
        .catch(error => displayError(error))
        $('.movies').fadeIn()
    if (pageId()==1) $('.prev').hide()
    $('.current').text(`Page: ${pageId()}`)
}

// Additional functions
function showClearIcon() {
    $('label span').show()
}
function clearText() {
    $('#input').val('')
    $('label span').hide()
}