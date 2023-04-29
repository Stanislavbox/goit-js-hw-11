import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const URL = 'https://pixabay.com/api/';
const API_KEY = '?key=35849876-3ddc90380cea496254cb66003';
let END_POINT = '';
const PARAMS = '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
let currentPage = 1;

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more')

loadMore.addEventListener('click', onloadMore)

async function onloadMore (e){
  e.preventDefault();

  currentPage +=1;

  await getReques(currentPage)
  .then((resolt) =>{
    if((currentPage*40) >= resolt.data.totalHits){
      loadMore.hidden = true;
    }

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  })
}


formEl.addEventListener('submit', hendlerInput);

function hendlerInput (e){
  e.preventDefault();

  END_POINT = e.currentTarget.elements.searchQuery.value.trim()
  clearGallery()
  if(!END_POINT){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  getReques().then((resolt) =>Notiflix.Notify.success(`Hooray! We found ${resolt.data.totalHits} images.`))
}

async function getReques(currentPage){
  const resolt = await axios.get(`${URL}${API_KEY}&q=${END_POINT}${PARAMS}&page=${currentPage}`)

  let images = resolt.data.hits;
  if(images.length === 0){
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }

  galleryEl.insertAdjacentHTML('beforeend', addMarkap(resolt.data.hits));

  const gallery = new SimpleLightbox('.simplelightbox');
  gallery.refresh();

  // observer.observe(target) // !!!!! infiniti scrol

  if((currentPage*40) !== resolt.data.totalHits){
    loadMore.hidden = false;
  }
    return resolt;
}

function addMarkap(arrImg){
  return arrImg.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<div class="photo-card">
    <a href="${largeImageURL}" class="simplelightbox"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div>`
  ).join('')
}

function clearGallery(){
  galleryEl.innerHTML = '';
}




// ? Ininiti Scroll


// const target = document.querySelector('.js-guard')

// let options = {
//   root: null,
//   rootMargin: '300px',
//   threshold: 1.0
// }

// let observer = new IntersectionObserver(onLoad, options);


// function onLoad(entries, observer){
//   entries.forEach( entry => {
//     if(entry.isIntersecting){
//       currentPage +=1
//       getReques(currentPage).then((resolt) =>{
//       galleryEl.insertAdjacentHTML('beforeend', addMarkap(resolt.data.hits));
//       if((currentPage*40) >= resolt.data.totalHits){
//         observer.unobserve(target)
//       }
//     })
    
//     }
//   });
// }