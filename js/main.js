//Example fetch using pokemonapi.co

"use strict";

document.querySelector("#button").addEventListener("click", () => {
  newComparison.fetchPoke1Data();
});

document.body.addEventListener("keydown", e => {
  if(e.key === "Enter") {
    document.querySelector("#button").click();
  }
});


class ComparePokemonTypes {

  constructor() {
    this.poke1Types = [];
    this.poke2Types = [];
  }

  fetchPoke1Data() {

    this.clearData();

    this.moveHeader();

    const choice = document.querySelector("#poke1").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`;
    fetch(url)
      .then(response => response.json())
      .then(async data => {

        this.poke1Types = data.types;

        this.removeHidden();
      
        this.createLIElements(this.poke1Types, "pokeUL1");

        const poke1Image = data.sprites.other["official-artwork"].front_default;
        this.showPokeImage(poke1Image, "pokeImg1");

        await this.fetchPoke2Data();

        this.showDmgRelations(this.poke1Types, this.poke2Types, "desc1"); 

      })
      .catch(error => {
        this.removeHidden();
        this.createAlerMsg("desc1", document.querySelector("#poke1").value);
        console.log("Error: ", error);
      })
  };

  fetchPoke2Data() {

    const choice = document.querySelector("#poke2").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`;
    return fetch(url)
      .then(response => response.json())
      .then(async data => {
        console.log("Poke 2 data: ",data)

        this.poke2Types = data.types;
        this.createLIElements(this.poke2Types, "pokeUL2");

        const poke2Image = data.sprites.other["official-artwork"].front_default;
        this.showPokeImage(poke2Image, "pokeImg2");

        this.showDmgRelations(this.poke2Types, this.poke1Types, "desc2");

      })
      .catch(error => {
        this.createAlerMsg("desc2", document.querySelector("#poke2").value);
        console.log("Error: ", error);
      })
  };

  moveHeader() {
    document.querySelector("header").style.marginTop = "3%";
  }

  removeHidden() {
    document.querySelector("main").classList.remove("hidden");
  }


  clearData() {
    const parentElement1 = document.querySelector("#pokeUL1");
    while(parentElement1.firstChild) {
      parentElement1.removeChild(parentElement1.firstChild);
    }

    const parentElement2 = document.querySelector("#pokeUL2");
    while(parentElement2.firstChild) {
      parentElement2.removeChild(parentElement2.firstChild);
    }

    document.querySelector("#pokeImg1").src = "";
    document.querySelector("#pokeImg1").alt = "";
    document.querySelector("#pokeImg2").src = "";
    document.querySelector("#pokeImg2").alt = "";

    document.querySelector(`#desc1`).innerText = "";
    document.querySelector(`#desc2`).innerText = "";    
  }

  createAlerMsg(id, input) {
    document.querySelector(`#${id}`).innerText = `Sorry, couldn't find the Pokemon named "${input}".`;
  }

  createLIElements(array, id) {
    const parentULElement = document.querySelector(`#${id}`)
    array.forEach(typeObj => {
      const newULElement = document.createElement("li");
      newULElement.textContent = typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1);
      parentULElement.appendChild(newULElement);
    });
  };

  createPElements(msg, id) {
    const parentElement = document.querySelector(`#${id}`)
    const newElement = document.createElement("p");
    newElement.innerHTML = msg;
    parentElement.appendChild(newElement);
  }

  showPokeImage(imageUrl, imgId) {
    document.querySelector(`#${imgId}`).src = imageUrl;
    document.querySelector(`#${imgId}`).alt = "Picture of the chosen pokemon.";
  };

  showDmgRelations(attackingTypes, defendingTypes, descriptionId) {

    attackingTypes.forEach(typeObj => {
      fetch(typeObj.type.url)
      .then(res => res.json())
      .then(data => { 
        defendingTypes.forEach(typeObj => {

          let isNormalDmg = true;

          data.damage_relations.double_damage_to.forEach(dd => {
            if(dd.name.includes(typeObj.type.name)) {
            
              const doubleDamageMsg = `${data.name.toUpperCase()} attacks do <span class="doubleDMG">DOUBLE</span> damage to ${typeObj.type.name.toUpperCase()} type pokemon.`;
              this.createPElements(doubleDamageMsg, descriptionId);

              isNormalDmg = false;
            } 
          })

          data.damage_relations.half_damage_to.forEach(hd => {
            if(hd.name.includes(typeObj.type.name)) {

              const halfDamageMsg = `${data.name.toUpperCase()} attacks do <span class="halfDMG">HALF</span> damage to ${typeObj.type.name.toUpperCase()} type pokemon.`;
              this.createPElements(halfDamageMsg, descriptionId);
              
              isNormalDmg = false;
            }
          })
            
          if(isNormalDmg) {
            const normalDamageMsg = `${data.name.toUpperCase()} attacks do <span class="normalDMG">NORMAL</span> damage to ${typeObj.type.name.toUpperCase()} type pokemon.`;
            this.createPElements(normalDamageMsg, descriptionId);
          }
        })
      })
      .catch(error => {
        console.log("Error: ", error);
      })
    })
  
  } 
  
}

const newComparison = new ComparePokemonTypes();

