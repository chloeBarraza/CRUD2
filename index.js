window.onload = function () {
  const addButtons = document.getElementsByClassName("button");
  const inputBoxes = document.getElementsByClassName("pokemon");
  const cells = document.getElementsByClassName("cell");

  //------------------------empty inputBox---------------------------//
  function clearInputbox() {
    for (let i = 0; i < inputBoxes.length; i++) {
      inputBoxes[i].value = "";
    }
  }

  //------------------------getting info---------------------------//
  function displayPokemonDetails(data, cell) {
    //getting name
    let h1 = document.createElement("h1");
    h1.innerHTML = data.name[0].toUpperCase() + data.name.slice(1);
    cell.appendChild(h1);
    //getting number
    let idNumber = document.createElement("h3");
    idNumber.innerHTML = "# " + data.id;
    cell.appendChild(idNumber);
    //getting image
    let img = document.createElement("img");
    img.src = data.sprites.front_default;
    img.class = "sprite";
    cell.appendChild(img);
  }

  function handleError(error) {
    alert(error);
  }

  //------------------------add---------------------------//
  function handleAdd(cell) {
    fetch(
      "https://pokeapi.co/api/v2/pokemon/" +
        cell.querySelector(".pokemon").value.toLowerCase()
    )
      .then((response) => {
        if (!response.ok) {
          throw "Invalid Pokemon name. Try again.";
        }
        return response.json();
      })
      .then((data) => {
        displayPokemonDetails(data, cell);
        //switch button to Swap
        toggleToSwap(cell.querySelector(".button"));
        clearInputbox();
        //create delete button
        displayDelButton(cell);
        return false;
      })
      .catch(handleError);
  }

  //------------------------swap---------------------------//
  function handleSwap(cell) {
    fetch(
      "https://pokeapi.co/api/v2/pokemon/" +
        cell.querySelector(".pokemon").value.toLowerCase()
    )
      .then((response) => {
        if (!response.ok) {
          throw "Invalid Pokemon name. Try again.";
        }

        if (confirm("Are you sure?")) {
          handleDelete(cell);
          handleAdd(cell);
        }
        return response.json();
      })
      .catch(handleError);
  }
  function toggleToSwap(button) {
    button.innerHTML = "Swap";
    button.class = "Swap";

    button.onclick = () => {
      handleSwap(button.parentElement);
    };
  }
  //------------------------delete---------------------------//
  function displayDelButton(cell) {
    let newButton = document.createElement("button");
    newButton.className = "deleteButton";
    newButton.innerHTML = "Delete";
    newButton.onclick = function () {
      if (confirm("Are you sure?")) {
        handleDelete(cell);
        alert("Pokemon deleted!");
      }
    };
    cell.appendChild(newButton);
  }

  function handleDelete(cell) {
    let swapButton = cell.querySelector(".button");
    cell.removeChild(cell.querySelector("h1"));
    cell.removeChild(cell.querySelector("h3"));
    cell.removeChild(cell.querySelector("img"));
    swapButton.innerHTML = "Add";
    swapButton.onclick = function () {
      handleAdd(cell);
    };
    cell.removeChild(cell.querySelector(".deleteButton"));
  }

  //------------------Gengar-------------------------//
  fetch("https://pokeapi.co/api/v2/pokemon/gengar")
    .then((response) => response.json())
    .then((data) => {
      let firstCell = document.getElementById("one");
      displayPokemonDetails(data, firstCell);
    })
    .then(() => {
      //------------------make random pokemon-------------------------//
      let fetches = [];
      for (let i = 0; i < 3; i++) {
        let rndInt = Math.floor(Math.random() * 905) + 1;
        fetches.push(fetch("https://pokeapi.co/api/v2/pokemon/" + rndInt));
      }
      Promise.all(fetches)
        .then((responses) => responses.map((response) => response.json()))
        .then((responses) =>
          Promise.all(responses).then((data) => {
            for (let i = 1; i < 4; i++) {
              displayPokemonDetails(data[i - 1], cells[i]);
            }
          })
        )
        .then(() => {
          //------------------change to swap-------------------------//
          for (let i = 0; i < cells.length; i++) {
            addButtons[i].onclick = function () {
              handleAdd(cells[i]);
            };
            if (cells[i].children.length > 2) {
              toggleToSwap(addButtons[i]);
              displayDelButton(cells[i]);
            }
          }
        });
    });
};
