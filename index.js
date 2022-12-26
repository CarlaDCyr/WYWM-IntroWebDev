//Connecting HTML to JS
const title = document.getElementById('title');
const search = document.getElementById('findByIngredient');
const ingredient = document.getElementById('cocktailIngredient');
const getRandom = document.getElementById('randomButton');
const drinkSection = document.getElementById('drink-section');

// API URLS
const randomURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
const idURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';


function checkStatus(response) {
    if (response.status !== 200) {
      throw new Error(`Status error: ${response.status}`)
  
    } else {
      return response.json()
    }
  }
  
  
  function clearBar() {
    while (drinkSection.firstChild) {
      drinkSection.removeChild(drinkSection.lastChild);
    }
  }
  
  
  function addCocktail(data) {
    displayCocktail(data.drinks[0]);
  }

function getRandomCocktail() {
    fetch(randomURL)
    .then(checkStatus)
    .then(replaceCurrentCocktail)
        .catch(function (err) {
            console.log('There was an error:', err);
        });

    function replaceCurrentCocktail(data) {
        clearBar ()
        addCocktail(data)
    }
}

function findByIngredient() {
    const chosenIngredient = ingredient.value
    if (!chosenIngredient) {
      return
    } else if (chosenIngredient.indexOf(",") > -1) {
      return
    }
    

   const searchURL = `${ingredientURL}${chosenIngredient}`;
    fetch(searchURL)
    .then(checkStatus)
    .then(replaceCurrentCocktails)
        .catch(function (err) {
            console.log('There was an error:', err);
        });
 /**
   *
   * @param {Object} data
   */

  function replaceCurrentCocktails(data) {
    clearBar()
    data.drinks.forEach(getCocktailById);
  }
  function getCocktailById(cocktailData) {
    const id = cocktailData.idDrink
    const searchURL = `${idURL}${id}`

    fetch(searchURL)
    .then(checkStatus)
    .then(addCocktail)
    .catch(error => console.log("Error in getCocktailById", error));
  }
}

function displayCocktail(cocktail) {
    const drinkName = document.createElement('h2');
    drinkName.innerHTML = cocktail.strDrink;
    drinkSection.appendChild(drinkName);
    //add image of the cocktail
    const img = document.createElement('img');
    img.src = cocktail.strDrinkThumb;
    drinkSection.appendChild(img);
    // add <ul> with ingredients
    const ul = document.createElement('ul');
    drinkSection.appendChild(ul)

    for (let i = 1; i < 16; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        if (!ingredient) {
            break;
        }
        let quantity = cocktail[`strMeasure${i}`] || "";
        if (quantity) {
            quantity = ": " + quantity
        }
        const ingredientLI = document.createElement("li");
        ingredientLI.innerText = ingredient + quantity;
        ul.appendChild(ingredientLI);
    }

    let instructions = document.createElement("p");
    instructions.innerHTML = cocktail.strInstructions;
    drinkSection.appendChild(instructions);
}

function checkForEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      findByIngredient()
    }
  }
  
  search.addEventListener("click", findByIngredient)
  ingredient.addEventListener("keyup", checkForEnter)

getRandomCocktail();
getRandom.addEventListener("click", getRandomCocktail)