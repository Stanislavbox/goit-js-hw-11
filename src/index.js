import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



// Notiflix.Notify.success('Sol lucet omnibus');

// Notiflix.Notify.failure('Qui timide rogat docet negare');

// Notiflix.Notify.warning('Memento te hominem esse');

// Notiflix.Notify.info('Cogito ergo sum');





  const URL = 'https://pixabay.com/api/';
  const API_KEY = '?key=35849876-3ddc90380cea496254cb66003';
  let END_POINT = '';
  const PARAMS = '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
  let page = 1;

  const formEl = document.querySelector('.search-form');
  const galleryEl = document.querySelector('.gallery')
  
 


formEl.addEventListener('submit', hendlerInput);

function hendlerInput (e){
  e.preventDefault();

  END_POINT = e.currentTarget.elements.searchQuery.value.trim()
  if(!END_POINT){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  clearGallery();
  page = 1;

  getReques()

}

async function getReques(){
 const resolt = await axios.get(`${URL}${API_KEY}&q=${END_POINT}${PARAMS}&page=${page}`)

    const images = resolt.data.hits;
    
    // console.log(images);
    console.log(galleryEl)
    
    galleryEl.insertAdjacentHTML('beforeend', addMarkap(images));

    const gallery = new SimpleLightbox('.simplelightbox');
    gallery.refresh();
    
    if(images.length === 0){
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    return images;
  
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