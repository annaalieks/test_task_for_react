'use strict';

// VARIABLES

const goBack = document.querySelector('.btn--back');
const artist = document.querySelector('.input--artist');
const addBtns = document.querySelectorAll('.btn--add-to-collection');
const paginationContainer = document.querySelector('.container--pagination');
const discHolders = document.querySelectorAll('.disc__holder');
const inputArtist = document.querySelector(".input--artist");
const inputGenre = document.querySelector(".input--genre");
const inputCountry = document.querySelector(".input--country");
const inputDecade = document.querySelector(".input--decade");
const search = document.querySelector(".input--search");
const urlParams = new URLSearchParams(window.location.search);
const currentPage = parseInt(urlParams.get('page')) || 1;

// FUNCTION CALLS AND EVENT LISTENERS

setDiscHolderAttributes();
generatePagination();
goBack.addEventListener('click', goToPreviousPage);
artist.addEventListener('input', exceedCharsAmount);
search.addEventListener('click', filterDiscs);
addBtns.forEach(addBtn => {
    addBtn.addEventListener('click', addDiscToLocalStorage);
});

// FUNCTIONS

// Generate paginations
function generatePagination() {

    paginationContainer.innerHTML = '';
    const totalPages = 8; // Total number of pages
    let visibleLinksCount; // Number of visible page links

    if (currentPage === 8) {
        visibleLinksCount = 4;
    } else if (currentPage < 3) {
        visibleLinksCount = 2;
    } else {
        visibleLinksCount = 3;
    }

    // Show the first page number
    appendPaginationLink(1);

    // Show ellipsis if the current page is more than visible links count
    if (currentPage > visibleLinksCount) {
        appendEllipsis();
    }

    // Calculate the start and end indexes for the visible links
    let startIndex = Math.max(currentPage - Math.floor(visibleLinksCount / 2), 2);
    let endIndex = Math.min(startIndex + visibleLinksCount - 1, totalPages - 1);

    // Show the visible page numbers
    for (let i = startIndex; i <= endIndex; i++) {
        appendPaginationLink(i);
    }

    // Show ellipsis if there are more pages after the visible links
    if (endIndex < totalPages - 1) {
        appendEllipsis();
    }

    // Show the last page number
    appendPaginationLink(totalPages);

}

// Generate page in pagination
function appendPaginationLink(page) {
    const link = document.createElement('a');
    link.href = `index.html?page=${page}`;
    link.textContent = page;
    link.classList.add('pagination__link');

    if (page === currentPage) {
        link.classList.add('active');
    }

    paginationContainer.appendChild(link);
}

// Generate ellips in pagination
function appendEllipsis(startIndex, endIndex) {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.classList.add('pagination__ellipsis');
    paginationContainer.appendChild(ellipsis);
}

// Previous page
function goToPreviousPage() {
    history.back();
}

// Error message 
function exceedCharsAmount() {
    const maxNumOfChars = 20;
    let numOfEnteredChars = artist.value.length;
    let counter = maxNumOfChars - numOfEnteredChars;
    if (counter < 0) {
        let div = document.createElement('div');
        div.innerHTML = 'You have exceeded the maximum number of characters in this field';
        div.classList.add('error-message');

        const errorMessage = document.querySelector('.error-message');
        if (!errorMessage) {
            insertAfter(div, artist);
        } else {
            setTimeout(() => {
                errorMessage.remove();
            }, 2000);
        }
    }
}

// Inser after for error message
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

// Add disc holder attributes for local storage
function setDiscHolderAttributes() {
    
    discHolders.forEach(discHolder => {

        const discHolderChildren = discHolder.querySelector('.disc__description').children;
        const childrenArray = Object.values(discHolderChildren);

        // Retrieving data attribute names from children class names
        const discHolderAttributesNames = childrenArray.map(name => name.className.split('__').slice(-1));
        // Retrieving data attribute values from children values
        const discHolderAttributesValues = childrenArray.map(value => value.textContent.trim().replace(/\n\s+/g, '').split(':').slice(-1));

        // Create object from 2 arrays
        const namesValuesObject = {};
        for (let i = 0; i < discHolderAttributesNames.length; i++) {
            const key = discHolderAttributesNames[i];
            const value = discHolderAttributesValues[i];
            namesValuesObject[key] = value;
        }

        // Add data attributes to .disc__holder element
        Object.entries(namesValuesObject).forEach((entry) => {
            discHolder.dataset[entry[0]] = entry[1];
        })      
    });
};

// Generate local storage disc collection
function addDiscToLocalStorage(event) {
    let btnHolder = event.target.parentElement;

    const savedCollection = localStorage.getItem('localStorageCollection');
    let discCollection = [];

    if (savedCollection) {
        discCollection = JSON.parse(savedCollection);
    };

    // Prevent readding the disc to local storage
    const existsInCollection = discCollection.some(disc => (
        disc.discName === btnHolder.dataset.name &&
        disc.discArtist === btnHolder.dataset.artist &&
        disc.discYear === btnHolder.dataset.year &&
        disc.discStyle === btnHolder.dataset.style &&
        disc.discCountry === btnHolder.dataset.country
    ));

    if (!existsInCollection) {
        discCollection.push({
            discName: btnHolder.dataset.name,
            discArtist: btnHolder.dataset.artist,
            discYear: btnHolder.dataset.year,
            discStyle: btnHolder.dataset.style,
            discCountry: btnHolder.dataset.country
        });
    }

    localStorage.setItem('localStorageCollection', JSON.stringify(discCollection));
}

// Filter

function filterDiscs() {
    const artistFilter = inputArtist.value.toLowerCase();
    const genreFilter = inputGenre.value;
    const countryFilter = inputCountry.value;
    const decadeFilter = inputDecade.value;

    discHolders.forEach(discHolder => {
        const discArtist = discHolder.querySelector(".disc__artist").textContent.toLowerCase();
        const discStyle = discHolder.querySelector(".disc__style").querySelector(".value").textContent.toLowerCase();
        const discCountry = discHolder.querySelector(".disc__country").querySelector(".value").textContent.toLowerCase();
        const discYear = + discHolder.querySelector(".disc__year").querySelector(".value").textContent;

        const matchesArtist = discArtist.includes(artistFilter);
        const matchesGenre = discStyle.includes(genreFilter);
        const matchesCountry = discCountry.includes(countryFilter);
        const matchesDecade = (
            (decadeFilter === "1950-60" && (discYear >= 1950 && discYear <= 1960))
            || (decadeFilter === "1960-70" && (discYear >= 1960 && discYear <= 1970))
            || (decadeFilter === "1970-80" && (discYear >= 1970 && discYear <= 1980))
            || (decadeFilter === "1980-90" && (discYear >= 1980 && discYear <= 1990))
            || (decadeFilter === "1990-00" && (discYear >= 1990 && discYear <= 2000))
            || (decadeFilter === "2000-10" && (discYear >= 2000 && discYear <= 2010))
            || (decadeFilter === "2010-20" && (discYear >= 2010 && discYear <= 2020))
            || (decadeFilter === "2020-30" && (discYear >= 2020 && discYear <= 2030))
        );

        if ((artistFilter !== "" && !matchesArtist)
            || (genreFilter !== "" && !matchesGenre)
            || (countryFilter !== "" && !matchesCountry)
            || (decadeFilter !== "" && !matchesDecade) 
        ){
            discHolder.style.display = 'none';
        } else {
            discHolder.style.display = 'block';
        }
    });
    
    inputArtist.value = "";
    inputGenre.value = "";
    inputCountry.value = "";
    inputDecade.value = "";
}


    

 