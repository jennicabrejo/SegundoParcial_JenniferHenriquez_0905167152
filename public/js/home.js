//obtiene la referencia al contenedor main
const main = document.querySelector(".mainHome");
const arreglo = [];

/* consigue el listado de generos */
fetch(
        genres_list_http +
        new URLSearchParams({
            api_key: api_key,
            language: "es",
        })
    )
    .then((res) => res.json())
    .then((data) => {
        listGenero(data);
        console.log(data);
        data.genres.forEach((item) => {
            fetchListaPeliculasPorGenero(item.id, item.name);
        });
    });

fetch(
        certification_movies +
        new URLSearchParams({
            api_key: api_key,
            language: "es",
        })
    )
    .then((res) => res.json())
    .then((data) => {
        SelectClas(data.certifications.US);
    });

const fetchListaPeliculasPorGenero = (id, genres, oPrametros = {}) => {
    fetch(
            movie_genres_http +
            new URLSearchParams({
                api_key: api_key,
                with_genres: id,
                page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
                language: "es",
                ...oPrametros,
            })
        )
        .then((res) => res.json())
        .then((data) => {

            arreglo.push(...data.results);
            construirElementoCategoria(`${genres}_movies`, data.results);
        })
        .catch((err) => console.log(err));
};

/* crea el titulo de categoria */
const construirElementoCategoria = (category, data) => {
    main.innerHTML += `
    <div class="movie-list">
        <button class="pre-btn"> <img src="img/pre.png" alt=""></button>
          
          <h1 class="movie-category">${category.split("_").join(" ")}</h1>

          <div class="movie-container" id="${category}">
          </div>

        <button class="nxt-btn"> <img src="img/nxt.png" alt=""> </button>
    </div>
    `;
    construirTarjetas(category, data);
};

const construirTarjetas = (id, data) => {
    const movieContainer = document.getElementById(id);
    data.forEach((item, i) => {
        if (item.backdrop_path == null) {
            item.backdrop_path = item.poster_path;
            if (item.backdrop_path == null) {
                return;
            }
        }

        movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
        `;

        if (i == data.length - 1) {
            setTimeout(() => {
                setupScrolling();
            }, 100);
        }
    });
};

const SelectClas = (data = []) => {
    const select = document.getElementById("clasi");
    data.forEach((item) => {
        let option = document.createElement("option");
        option.text = item.certification;
        option.value = item.certification;
        select.add(option);
    });
};

const listGenero = (data = []) => {
    const generos = data.genres;
    console.log(generos.length);
    let divContenedor = document.getElementById("inputGenero");
    let htmlSel = "<select id='selectGenero'>";
    generos.forEach((genero, index) => {
        htmlSel += `
        <option value="${genero.id}" id='optionGenero' label="${genero.name}" selected>${genero.name}</option>    
     `;
    });

    htmlSelect = htmlSel + "</select>"
    document.getElementById('inputGenero').outerHTML = htmlSelect;

};


const Filtros = () => {
    let selec = document.getElementById("selectGenero");
    var value = selec.options[selec.selectedIndex].value;
    var name = selec.options[selec.selectedIndex].label;

    let generosSeleccionados = [];
    let oParametros = {};

    let anio = document.getElementById("anio").value;
    if (anio) {
        oParametros.year = anio;
    }
    let adultos = document.getElementById("adult");
    if (adultos.checked) {
        oParametros.include_adult = true;
        oParametros.sort_by = "vote_count.asc";
    }


    let seleccionar = document.getElementById("clasi").value;
    if (seleccionar && seleccionar != "0") {
        oParametros.certification_country = "US";
        oParametros.certification = seleccionar;
    }

    console.log({ oParametros });
    main.innerHTML = "";
    fetchListaPeliculasPorGenero(value, name, oParametros);
    console.log({ generosSeleccionados });
};