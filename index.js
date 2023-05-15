var pokemon = [];

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
  console.log("numPages: ", numPages);

  showPage(1);

  //Click on type filter checkboxes-------------------------------------------
  $('body').on('click', '.typeFilter', async function (e) {

    // var selectedTypes = [];

    // const selectedType = e.target.value;

    // if (e.target.checked) {
    //   selectedTypes.push(selectedType);
    // } else {
    //   selectedTypes = selectedTypes.filter(type => type !== selectedType);
    // }
    // console.log("selectedTypes: ", selectedTypes);

    // showPage(currentPage);


  });


  //Click on more button-------------------------------------------
  $('body').on('click', '.pokeCard', async function (e) {
    // console.log(this);
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    // console.log("types: ", types);

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
  })

  //Click on pagination buttons-------------------------------------------
  $('body').on('click', ".pageBtn", async function (e) {
    const pageNum = parseInt($(this).attr(`pageNum`));
    console.log("=================pageBtn clicked==================");
    console.log("pageNum: ", pageNum);
    showPage(pageNum);
  });


  console.log("end of setup");
}







async function showPage(currentPage) {
  if (currentPage < 1) {
    currentPage = 1;
  }
  if (currentPage > numPages) {
    currentPage = numPages;
  }

  console.log("showPage: ", currentPage);
  console.log("start: ", (currentPage - 1) * numPerPage);
  console.log("end: ", ((currentPage - 1) * numPerPage) + numPerPage);
  console.log("pokemon.length: ", pokemon.length);

  //Checkboxes-------------------------------------------
  $('#filter').empty();

  for (let i = 0; i < type.length; i++) {
    let res = await axios.get(`${type[i].url}`);

    $('#filter').append(`
      <input id="${res.data.name}" class="typeFilter" type="checkbox" name="type" value="${res.data.name}">
      <label htmlfor="${res.data.name}" for="${res.data.name}"> ${res.data.name} </label>
    `);

  }


  //header-------------------------------------------
  $('#numHeader').empty();

  var start = (currentPage - 1) * numPerPage;
  var end = ((currentPage - 1) * numPerPage) + numPerPage;
  var numCurrentPage = end - start;
  console.log("numCurrentPage: ", numCurrentPage);

  $('#numHeader').append(`
    <h3>Showing ${numCurrentPage} of ${pokemon.length} pokemons</h3>
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
  console.log("numPages: ", numPages);
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