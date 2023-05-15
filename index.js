var pokemon = [];
var finalfilteredPokemon = [];
var selectedTypes = [];

const numPerPage = 10
var numPages = 0;
const numPageBtn = 5;
let currentPage = 1;

const setup = async () => {
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemon = response.data.results;
  console.log("pokemon: ", pokemon);

  let responseType = await axios.get('https://pokeapi.co/api/v2/type');
  type = responseType.data.results;
  console.log("type: ", type);

  numPages = Math.ceil(pokemon.length / numPerPage);
  console.log("numPages (pokemon): ", numPages);

  showPage(1, pokemon, selectedTypes);


  //Click on type filter checkboxes-------------------------------------------
  
  $('body').on('click', '.typeFilter', async function (e) {

    var value = $(this).val();

    if ($(this).is(':checked')) {
        if (selectedTypes.indexOf(value) === -1) {
          selectedTypes.push(value);
        }

    } else {
      var index = selectedTypes.indexOf(value);
      if (index !== -1) {
        selectedTypes.splice(index, 1);
      }
    }

    console.log("selectedTypes: ", selectedTypes);


    const filteredPokemon = await Promise.all(pokemon.map(async (p) => {
      const pokemonName = p.name;
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const types = res.data.types.map((type) => type.type.name);

      //logic "OR"
      // if (types.some((t) => selectedTypes.includes(t))) {

      //logic "AND"
      if (selectedTypes.every((t) => types.includes(t))) {
        return p;
      }

    }));

    console.log("filteredPokemon: ", filteredPokemon);

    finalfilteredPokemon = filteredPokemon.filter((value) => value !== undefined);
    console.log("finalfilteredPokemon: ", finalfilteredPokemon);
    console.log("(filter) finalfilteredPokemon.length: ", finalfilteredPokemon.length);

    numPages = Math.ceil(finalfilteredPokemon.length / numPerPage);
    console.log("numPages (filter): ", numPages);

    showPage(currentPage, finalfilteredPokemon, selectedTypes);
  });


  //Click on more button-------------------------------------------
  $('body').on('click', '.pokeCard', async function (e) {
    // console.log(this);
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    console.log("types: ", types);

    //detail modal
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
    console.log("=================pageBtn clicked==================");
    console.log("pageNum: ", pageNum);

    console.log("(pagination) finalfilteredPokemon.length: ", finalfilteredPokemon.length);
    if (finalfilteredPokemon.length > 0) {
      showPage(pageNum, finalfilteredPokemon, selectedTypes);
    } else {
      showPage(pageNum, pokemon, selectedTypes);
    }
  });


  console.log("end of setup");

};




async function showPage(currentPage, pokemon, selectedTypes) {
  if (currentPage < 1) {
    currentPage = 1;
  }
  if (currentPage > numPages) {
    currentPage = numPages;
  }

  console.log("currentPage: ", currentPage);
  console.log("numPages (showpage): ", numPages);
  console.log("pokemon.length: ", pokemon.length);

  //Checkboxes-------------------------------------------
  $('#filter').empty();

  for (let i = 0; i < type.length; i++) {
    let res = await axios.get(`${type[i].url}`);

    let isChecked = selectedTypes.includes(res.data.name);

    // console.log("res.data.name: ", res.data.name);

    $('#filter').append(`
      <input id="${res.data.name}" class="typeFilter" type="checkbox" name="type" value="${res.data.name}" ${isChecked ? 'checked' : ''}>
      <label htmlfor="${res.data.name}" for="${res.data.name}"> ${res.data.name} </label>
    `);

  }


  //header-------------------------------------------
  $('#numHeader').empty();

  var start = (currentPage - 1) * numPerPage;
  var end = ((currentPage - 1) * numPerPage) + numPerPage;

  if (currentPage === numPages) {
    end = pokemon.length;
  }

  console.log("start: ", start);
  console.log("end: ", end);

  var numCurrentPage = end - start;
  console.log("numCurrentPage: ", numCurrentPage);

  $('#numHeader').append(`
    <h3>Showing ${numCurrentPage} of ${pokemon.length} Pokemons</h3>
    `);


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

  //Pagination buttons-------------------------------------------
  $('#pagination').empty();

  var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
  var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));
  console.log("startI: ", startI);
  console.log("endI: ", endI);
  console.log("numPages (showpage2): ", numPages);
  console.log("currentPage: ", currentPage);
  console.log("numPageBtn: ", numPageBtn);


  if (currentPage > 1) {
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn" id="pagefirst" pageNum="1" value="1">First</button>`
    );
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 pageBtn" id="pageprev" pageNum="${currentPage - 1}" value="${currentPage - 1}">Prev</button>`
    );
  }

  //-2 ~ +2
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

}


$(document).ready(setup);