//Example fetch using pokemonapi.co

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
    this.poke1TypesUrls = [];
    this.poke2TypesUrls = [];
  }


  fetchPoke1Data() {

    const choice = document.querySelector("#poke1").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`;
    fetch(url)
      .then(response => response.json())
      .then(async data => {
        console.log("Poke 1 data: ", data)

        const poke1TypeArray = data.types;
        this.createLIElements(poke1TypeArray, "pokeUL1");

        const poke1Image = data.sprites.other["official-artwork"].front_default;
        this.showPokeImage(poke1Image, "pokeImg1");

        this.poke1TypesUrls = poke1TypeArray.map(type => type.type.url);

        await this.fetchPoke2Data();

        this.showDmgRelations(this.poke1TypesUrls, this.poke2TypesUrls, "desc1"); // => I need type1, type2, x2 and x1/2 dmg

      })
      .catch(error => {
        console.log("Error: ", error)
      })
  };

  fetchPoke2Data() {

    const choice = document.querySelector("#poke2").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`;
    return fetch(url)
      .then(response => response.json())
      .then(async data => {
        console.log("Poke 2 data: ",data)

        const poke2TypeArray = data.types;
        this.createLIElements(poke2TypeArray, "pokeUL2");

        const poke2Image = data.sprites.other["official-artwork"].front_default;
        this.showPokeImage(poke2Image, "pokeImg2");

        this.poke2TypesUrls = await poke2TypeArray.map(type => type.type.url);

        this.showDmgRelations(this.poke2TypesUrls, this.poke1TypesUrls, "desc2");

      })
      .catch(error => {
        console.log("Error: ", error)
      })
  };

  createLIElements(array, id) {
    const parentULElement = document.querySelector(`#${id}`)
    array.forEach(type => {
      const newULElement = document.createElement("li");
      newULElement.textContent = type.type.name;
      parentULElement.appendChild(newULElement);
    });
  };

  showPokeImage(imageUrl, imgId) {
    document.querySelector(`#${imgId}`).src = imageUrl;
  };


  showDmgRelations(attackingTypes, defendingTypes, descriptionId) {

    console.log("call id : ", descriptionId)
    console.log("defending types data: ",defendingTypes)

    
    attackingTypes.forEach(url => {
      fetch(url)
      .then(res => res.json())
      .then(data => { 

        console.log("Data for attacking type: ", data);
        
        defendingTypes.forEach(type => {

          console.log("defending type: ", type)

          let isNotNormalDmg = 0;

          data.damage_relations.double_damage_to.forEach(dd => {
           
            if(dd.url.includes(type)) {
              fetch(type)
              .then(res => res.json())
              .then(newData => {
                const typeName = newData.name;
                console.log(data.name, "does DOUBLE damage to ", typeName )
              })
              .catch(err => console.log(err))
              
              ++isNotNormalDmg;
            } 
          })

          data.damage_relations.half_damage_to.forEach(hd => {
           
            if(hd.url.includes(type)) {
              console.log(data.name, " does HALF damage to ", type )
              ++isNotNormalDmg;
            }
          })

          if(!isNotNormalDmg) {
            console.log(data.name, "does NORMAL damage to ", type )
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

