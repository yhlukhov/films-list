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
const pageId = paginator() //paginator instance
const apiKey = '2ddeab55' //api key

// Functions
function search() { //search and load movies list from OMdb
    let searchItem = $('#input').val()
    $('#searchTitle').text(`Search results for ${searchItem}:`)
    $('.movies').html(``)
    let xhr = new XMLHttpRequest() //Initialize http request
    xhr.open('GET', `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchItem}&page=${pageId()}`) //open http request
    xhr.send() //send request
    xhr.onreadystatechange = function () { //wait successful data retrieve
        if (xhr.readyState === 4)
            if (xhr.status === 200) {
                let moviesArray = JSON.parse(xhr.response).Search //storage array to load list of movies from OMdb
                for (let m of moviesArray) addMovie(m)
            }
    }
}

function addMovie(movie) { //add single movie item on page. parameter movie=object
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

function showModal() {
    $('#detailsModal').modal()
}