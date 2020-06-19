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

// Search and load movies list from OMdb
function search() {
    searchItem = $('#input').val()
    $('#searchTitle').text(`Search results for ${searchItem}:`)
    $('.movies').html(``)
    pageId = paginator()
    let xhr = new XMLHttpRequest() //Initialize http request
    xhr.open('GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId()}`) //open http request
    xhr.send() //send request
    xhr.onreadystatechange = function () { //wait successful data retrieve
        if (xhr.readyState === 4)
            if (xhr.status === 200) {
                let moviesArray = JSON.parse(xhr.response).Search //storage array to load list of movies from OMdb
                for (let m of moviesArray) addMovie(m)
                $('.current').text(`Page: ${pageId()}`)
                $('.paginator').css('display', 'flex');
                $('.prev').hide()
            }
    }
}
// Add single movie item on page
function addMovie(movie) {
    let item = `<div class="movie">`
    item += `<img src=${movie.Poster}></img>`
    item += `<h2>${movie.Title}</h2>`
    item += `<p>${movie.Type}</p>`
    item += `<p>${movie.Year}</p>`
    item += `<button class="more" value="${movie.imdbID}" onclick="details()">More details</button>`
    item += `</div>`
    $('.movies').append(item)
    console.log(item)
}

// Load Details page for selected movie
function details() {
    let movieId = $(event.target).val()
    let xhr = new XMLHttpRequest()
    xhr.open('GET', `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
    xhr.send()
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4)
            if (xhr.status === 200) {
                let movieData = JSON.parse(xhr.response)
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
    }
    $('#detailsModal').modal()
}

// Paginator
function prevPage() {
    $('.movies').html(``)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId('-')}`, false) //open http request
    xhr.send()
    let moviesArray = JSON.parse(xhr.response).Search
    for (let m of moviesArray) addMovie(m)
    if (pageId()==1) $('.prev').hide()
}

function nextPage() {
    $('.movies').html(``)
    $('.prev').show()
    let xhr = new XMLHttpRequest()
    xhr.open('GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId('+')}`, false) //open http request
    xhr.send()
    let moviesArray = JSON.parse(xhr.response).Search
    for (let m of moviesArray) addMovie(m)
    if (pageId()==1) $('.prev').hide()
}