var pokemon = [];

const numPerPage = 10
var numPages = 0;
const numPageBtn = 5;
let currentPage = 1;

const setup = async () => {
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    pokemon = response.data.results;

    let responseType = await axios.get('https://pokeapi.co/api/v2/type');
    type = responseType.data.results;

    numPages = Math.ceil(pokemon.length / numPerPage);

    showPage(1);

    //Click on type filter checkboxes-------------------------------------------
    $('body').on('click', '.typeFilter', async function (e) {

    });


}




async function showPage(currentPage) {
    if (currentPage < 1) {
        currentPage = 1;
    }
    if (currentPage > numPages) {
        currentPage = numPages;
    }

    //Checkboxes-------------------------------------------
    $('#filter').empty();

    for (let i = 0; i < type.length; i++) {
        let res = await axios.get(`${type[i].url}`);

        $('#filter').append(`
      <input id="${res.data.name}" class="typeFilter" type="checkbox" name="type" value="${res.data.name}">
      <label htmlfor="${res.data.name}" for="${res.data.name}"> ${res.data.name} </label>
    `);

    }


    //Pokemon cards-------------------------------------------
    $('#pokeCards').empty();
    for (let i = start; i < end; i++) {

        let res = await axios.get(`${pokemon[i].url}`);

        $('#pokeCards').append(`
      <div class="pokeCard card" pokeName="${res.data.name}">
        <h3>${res.data.name.toUpperCase()}</h3>
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `);
    }
}


$(document).ready(setup);







    //Header-------------------------------------------
    $('#numHeader').empty();

    var start = (currentPage - 1) * numPerPage;
    var end = ((currentPage - 1) * numPerPage) + numPerPage;
    var numCurrentPage = end - start;

    $('#numHeader').append(`
    <h3>Showing ${numCurrentPage} of ${pokemon.length} pokemons</h3>
    `);




    //Pagination buttons-------------------------------------------
    $('#pagination').empty();

    var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
    var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));


    if (currentPage > 1) {
        $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn" id="pagefirst" pageNum="1" value="1">First</button>`
        );
        $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn" id="pageprev" pageNum="${currentPage - 1}" value="${currentPage - 1}">Prev</button>`
        );
    }


    for (let i = startI; i <= endI; i++) {

        var active = "";
        if (i == currentPage) {
            active = "active";
        };

        $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn ${active}" id="page${i}" pageNum="${i}" value="${i}">${i}</button>
    `)
    }

    if (currentPage < numPages) {
        $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn" id="pagenext" pageNum="${currentPage + 1}" value="${currentPage + 1}">Next</button>`
        );
        $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn" id="pagelast" pageNum="${numPages}" value="${numPages}">Last</button>`
        );
    }







        //Click on more button-------------------------------------------
        $('body').on('click', '.pokeCard', async function (e) {
            const pokemonName = $(this).attr('pokeName')
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            const types = res.data.types.map((type) => type.type.name)
    
            //Detail modal
            $('.modal-body').html(`
              <div style="width:200px">
              <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
              <div>
              <h3>Abilities</h3>
              <ul>
              ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
              </ul>
              </div>
      
              <div>
              <h3>Stats</h3>
              <ul>
              ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
              </ul>
      
              </div>
      
              </div>
                <h3>Types</h3>
                <ul>
                ${types.map((type) => `<li>${type}</li>`).join('')}
                </ul>
            
              `)
            $('.modal-title').html(`
              <h2>${res.data.name.toUpperCase()}</h2>
              `)
        });
    
        //Click on pagination buttons-------------------------------------------
        $('body').on('click', ".pageBtn", async function (e) {
            const pageNum = parseInt($(this).attr(`pageNum`));
            showPage(pageNum);
        });