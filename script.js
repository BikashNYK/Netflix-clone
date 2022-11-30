// api key
const apiKey = 'dff04a053138ab151a7c81edf0f2dff7';
const apiEndpoint = 'https://api.themoviedb.org/3';
const imgPath = 'https://image.tmdb.org/t/p/original';
const trailer ='https://www.googleapis.com/youtube/v3/search?part=snippet&q=';
const googleApiKey ='AIzaSyAoGtH3oJkHVsMxqzj4M1NKK5MFxeutk48';
const apiPaths = {
    fetchCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesWithGenre: (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query)=> `${trailer}${query}&key=${googleApiKey}`
};


function init() {
    fetchTrendingMovies();
    fetchAndBuldAllSections();
}

function fetchTrendingMovies (){
    fetchAndBuildMovieSections('Trending Now', apiPaths.fetchTrending)
    .then(list => {
        const randomBannerImages= parseInt(Math.random()*list.length);
        buildBannerSection(list[randomBannerImages]);
    }).catch((err)=>{
        console.error(err);
    });
}

function buildBannerSection(item){
    const bannerContainer = document.getElementById('banner-container');
    bannerContainer.style.backgroundImage = `url(${imgPath}${item.backdrop_path})`;
    const div =document.createElement('div');
    div.innerHTML =`
            <h2 class="dem-heading">${item.title}</h2>
            <p class="demo-title">Trending in Movies | Released on - ${item.release_date}</p>
            <p class="demo">${item.overview && item.overview.length>200 ? item.overview.slice(0,200).trim()+ '...':item.overview}</p>
            <div class="action-buttons-cont">
                <button class="action-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="Hawkins-Icon Hawkins-Icon-Standard">
                    <path
                        d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                        fill="currentColor"></path>
                </svg>&nbsp;&nbsp;Play</button>
                <button class="action-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="Hawkins-Icon Hawkins-Icon-Standard">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                        fill="currentColor"></path>
                </svg> &nbsp;&nbsp; More Info</button>
        </div>`
    div.className ='banner-content container'
    bannerContainer.append(div);
}

function fetchAndBuldAllSections() {
    fetch(apiPaths.fetchCategories)
        .then(response => response.json())
        .then((jsonData) => {
            // console.log(jsonData);
            const categories = jsonData.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach((category) => {
                    fetchAndBuildMovieSections(category.name, apiPaths.fetchMoviesWithGenre(category.id));
                    // console.log(category);

                });
            }
            //  console.table(categories);
        }).catch((err) => {
            console.log(err);
        });
}

function fetchAndBuildMovieSections(categoryName, fetchURL) {
    // console.log(category, fetchURL);
   return fetch(fetchURL)
        .then(response => response.json())
        .then(jsonData => {
            // console.table(jsonData.results)
            const movies = jsonData.results;
            if (Array.isArray(movies) && movies.length) {
                buildMovieSections(movies, categoryName);
            }
            return movies;
        })
        .catch((err) => console.log(err));
}

function buildMovieSections(list, categoryName) {
    // console.log(list, categoryName);
    const moviesContainer = document.getElementById('movie-cont');
    const moviesListHTML = list.map(item => {
        return `
        <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">`;
    }).join('');

    const movieSectionHTML = `
            <h2 class="movie-sec-heading">${categoryName}<span class="explore">Explore All</span></h2>
            <div class="movie-row">
            ${moviesListHTML}
            </div>
    `;

    // console.table(movieSectionHTML);
    const div = document.createElement('div');
    div.className='movie-section'
    div.innerHTML=movieSectionHTML;

    // append html into container
    moviesContainer.append(div)
}

function searchMovieTrailer(movieName){
    if(!movieName) return;
    fetch(apiPaths.searchOnYoutube(movieName))
    .then((response)=>response.json())
    .then((jsonData)=>{
        console.log(jsonData);
        const bestResults = jsonData.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${ bestResults.id.videoId}`;
        console.log(youtubeUrl);
        console.log(youtubeUrl);
        window.open(youtubeUrl,'blank')
    }).catch(err=>console.log(err))
}
window.addEventListener('load', () => {
    init();
    window.addEventListener('scroll',()=>{
        // console.log('scrolling');
        // header ui update
        const hea = document.getElementById('header');
        if(window.scrollY){
            // console.log('d');
            hea.classList.add('black-baground');
        }else{
            hea.classList.remove('black-baground')
        }
    })
});