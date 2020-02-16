const btnElement = document.querySelector('.btn');
const inputElement = document.querySelector('input');
const imgElement = document.querySelector('img');
const evolveTXT = document.querySelector('#evolvesTXT');
const firstImgEvolve = document.querySelector('#first');
const secondImgEvolve = document.querySelector('#second');
const thirdImgEvolve = document.querySelector('#third');

let classON = false;

let verify;

btnElement.onclick = function(){
  mainFunction();
}

document.addEventListener('keydown', handleKey);

function handleKey(event){
  if (event.key === 'Enter'){
    mainFunction();
  }
}

async function mainFunction(){
  let pokeName = inputElement.value;

  if (pokeName === 'mr mime' || pokeName === 'mr. mime'){
    pokeName = 'mr-mime';
  }
  
  try{
    
    const urlPokeName = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    
    callImg(imgElement,pokeName);
    
    setFirstEvolve(urlPokeName.data.species.url);
    
    setLastEvolve(urlPokeName.data.species.url);

        
    async function setFirstEvolve(url){
      
      const pokeSpecieURL = await axios.get(url);
      
      const evolutionChain = await axios.get(pokeSpecieURL.data.evolution_chain.url);

      let pokeName = evolutionChain.data.chain.species.name;

      verify = pokeName;

      callImg(firstImgEvolve,pokeName);

      
    
    }

    async function setLastEvolve(url){
      
      const pokeSpecieURL = await axios.get(url);
      
      const evolutionChain = await axios.get(pokeSpecieURL.data.evolution_chain.url);
      try{
        let pokeName = evolutionChain.data.chain.evolves_to[0].evolves_to[0].species.name;
        

        callImg(thirdImgEvolve,pokeName);

        setMidEvolve(pokeName);

      }catch{
        try{
          let pokeName = evolutionChain.data.chain.evolves_to[0].species.name;
          
          
          if (classON){
            secondImgEvolve.classList.remove('none')
            thirdImgEvolve.classList.remove('none')
          }
          callImg(thirdImgEvolve,pokeName);

          setMidEvolve(pokeName);
        }catch{
          classON = true;
          secondImgEvolve.classList.add('none')
          thirdImgEvolve.classList.add('none')
        }
      }

    }

    async function setMidEvolve(midEvolve){

      const urlPokeName = await axios.get(`https://pokeapi.co/api/v2/pokemon/${midEvolve}`);

      let newUrl = urlPokeName.data.species.url;

      const newRequest = await axios.get(newUrl);

      let newName = newRequest.data.evolves_from_species.name;

      if (newName !== verify){
        if (classON){
          secondImgEvolve.classList.remove('none')
          thirdImgEvolve.classList.remove('none')
        }
        callImg(secondImgEvolve,newName);
      }else{
        classON = true;
        secondImgEvolve.classList.add('none')
      }
    }

    async function callImg(img,name){
      
      const mainImgData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      
      let mainImg = mainImgData.data.sprites.front_default;

      img.src = mainImg;
      

    
    }

    inputElement.value = '';
  
  }catch(e){
    alert('VERIFIQUE O NOME DIGITADO')
    console.log(e)
  }
}

