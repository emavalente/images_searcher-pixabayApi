const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");
const pagination = document.querySelector("#paginacion");

const resultsByPage = 30;
let totalPages;
let iterator;
let actualPage = 1;

window.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", formValidate);
});

function formValidate(e) {
  e.preventDefault();
  const search = document.querySelector("#termino").value;

  if (search.value === "") {
    showAlert("Debes colocar un término de búsqueda");
    return;
  } else {
    searchPictures();
    search.value = "";
  }
}

function showAlert(message) {
  const alertExist = document.querySelector(".bg-red-100");
  if (!alertExist) {
    const alert = document.createElement("P");
    alert.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );
    alert.innerHTML = `
    <strong class="block">Error!</strong>
    <span>${message}</span>
    `;

    form.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

async function searchPictures() {
  const term = document.querySelector("#termino").value;
  const key = "34180393-d5271e97bc20d32f5c06d8a0f";
  const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${resultsByPage}&page=${actualPage}`;
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    totalPages = pageCalculator(response.totalHits);
      showPictures(response.hits);
  } catch {
    console.log(error)
  }
}

function showPictures(pictures) {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  pictures.forEach((pic) => {
    const { previewURL, likes, views, largeImageURL } = pic;

    result.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
    <div class="bg-white">
    <img class="w-full" src='${previewURL}'/>
    <div class="p-4 ">
    <p class="font-bold flex justify-start items-center"><ion-icon class="text-red-600" name="heart-sharp"></ion-icon>  <span class="font-light ml-2">${likes}</span></p>
    <p class="font-bold flex justify-start items-center"><ion-icon class="text-green-400" name="eye-sharp"></ion-icon> <span class="font-light ml-2">${views}</span></p>
    
    <a class="block w-full mt-5 bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ampliar Imagen</a>
    </div>
    </div>
    </div>
    `;
  });

  // Clean the previous pagination
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  // Then print the paginator
  printPaginator();
}

function pageCalculator(total) {
  return parseInt(Math.ceil(total / resultsByPage));
}

// Creating a paginator
function* createPaginator(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function printPaginator() {
  iterator = createPaginator(totalPages);

  while (true) {
    const { value, done } = iterator.next();

    if (done) return;

    // Otherwise, will be generated a button for each element in generator.
    const pageBtn = document.createElement("A");
    pageBtn.href = "#";
    pageBtn.dataset.page = value;
    pageBtn.textContent = value;
    pageBtn.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "mb-4", "font-bold", "rounded");
    pageBtn.onclick = () => {
      actualPage = value;
      searchPictures();
    };
    pagination.appendChild(pageBtn);
  }
}
