const app = {
  
    init : ()=> { 
        document.addEventListener("DOMContentLoaded",console.log("loaded"),app.load())
    },
     load : ()=>{
        app.getData()
    },
     getData : ()=>{
    
          //The app will load only a single javascript code page to avoid memory issues on client side
          //Pages will be definide by the body-tag id
          //Each page has an id witch will load only the requered code for the page.
    
        let page = document.body.id 
    
        switch(page){
            //
            case "1" : {
                app.getGames()
                app.searchBar()
            }
            case "2" :{
                app.getGamesDetail()
            }
          
        }},
    
        //////////////////////// PAGE 1 CODE /////////////////////
        getGames : () =>{       
      
       
        localStorage.clear("selected")
        const category = "games"
        let url = 'https://api.rawg.io/api/games?key=3c25c0a4c6ef4b98ae8a0af760f18217&page=1'
        let req = new Request(url,{
            method:"GET"
        })
        fetch(req)
        .then(resp => resp.json())
        .then(data => app.createItem(data,category))
    
     },
     searchGame : (game) =>{       
    
        let url = `https://api.rawg.io/api/games?search=${game}&key=3c25c0a4c6ef4b98ae8a0af760f18217&page=1`
        let req = new Request(url,{
            method:"GET"
        })
        fetch(req)
        .then(resp => resp.json())
        .then(app.createItem)
    
     },
        

        dataForGeneralGames : (data) =>{
            
        app.createItem(data)    
        
        
        },
        getNextPAge :(url) =>{
            
            let req = new Request(url,{
                method:"GET"
            })
            fetch(req)
            .then(resp => resp.json())
            .then(app.createItem)
        },
        

        
        createItem : (data) =>{
            
             const category = "games"

            const grid_contrainer = document.querySelector(".grid-content")       
            grid_contrainer.innerHTML =""
            data.results.forEach(game => {
                if(game.background_image === undefined){
                    grid_contrainer.innerHTML +=`
                    <a href=""  class="item" data-id="${game.id}" data-category="${category}">
                    <div class="img "><img src="${game.image_background}" ></div>
                    <div class="txt"><h4>${game.name}</h4> </div>
                    </a>  `
                }
                else{
                    grid_contrainer.innerHTML +=`
                    <a href="" class="item"  data-id="${game.id}" data-category="${category}" >
                    <div class="img "><img src="${game.background_image}" ></div>
                    <div class="txt"><h4>${game.name}</h4> </div>  
                    </div>
                    </a>
                    `
                }    
            }); 

            // call pagination for each page when created
            app.selectItem()
            app.pagination(data)  
        },
        pagination : (data) =>{ 
    
        const paginationContainer = document.querySelector(".pagination")
    
        //tells if selected page has no next pages available
        
        console.log(data)
        paginationContainer.innerHTML = ""      
        if(data.next != null){  

            const a = document.createElement("a") 
            paginationContainer.appendChild(a)
            a.innerHTML = "Next page"

            a.addEventListener("click",()=>{
                app.getNextPAge(data.next)               
            })

        }
        else{
            paginationContainer.innerHTML = ""
            console.log("next page not available")
        } 

       
        if(data.previous != null){
            
            const b = document.createElement("a") 
            paginationContainer.appendChild(b)
            b.innerHTML = "Previus page"
            b.addEventListener("click",()=>{
                app.getNextPAge(data.previous)               
            })
        }
        else{
            console.log("No previus page")
        }

     },
     selectItem:()=>{
    
        const get_item = document.querySelectorAll('.item')
        get_item.forEach(item =>{

            item.addEventListener("click",()=>{
              
                event.preventDefault()

                let info = {
               
                    id : item.dataset.id,
                    category : item.dataset.category
        
                   }

                 localStorage.setItem("selected",JSON.stringify(info))
                 window.location = "selected.html"
                                 
            })
        })



     },
    
     searchBar:() =>{
             const search_bar = document.getElementById("search-game")
             const search_btn = document.getElementById("search-btn")

             search_btn.addEventListener("click",()=>{
              
                app.searchGame(search_bar.value)
             })


     },


  //////////////////////// PAGE 2 CODE /////////////////////


  getGamesDetail: () =>{       


    const selected = JSON.parse(localStorage.getItem("selected"))

    let url = `https://api.rawg.io/api/games/${selected.id}?key=3c25c0a4c6ef4b98ae8a0af760f18217`
    let req = new Request(url,{
        method:"GET"
    })
    fetch(req)
    .then(resp => resp.json())
    .then(app.detailedGame)
 },



 //Get basic prints 
 getGamesPrint: () =>{    

    const selected = JSON.parse(localStorage.getItem("selected"))

    let url = `https://api.rawg.io/api/games/${selected.id}/screenshots?key=3c25c0a4c6ef4b98ae8a0af760f18217`
    let req = new Request(url,{
        method:"GET"
    })
    fetch(req)
    .then(resp => resp.json())
    .then(app.gamesScreenshots)
 },
 //Get 
 getGameSeries: () =>{       


    const selected = JSON.parse(localStorage.getItem("selected"))

    let url = `https://api.rawg.io/api/games/${selected.id}/game-series?key=3c25c0a4c6ef4b98ae8a0af760f18217`
    let req = new Request(url,{
        method:"GET"
    })
    fetch(req)
    .then(resp => resp.json())
    .then(app.gameSeries)
 },

 getGameAddons: () =>{       


    const selected = JSON.parse(localStorage.getItem("selected"))

    let url = `https://api.rawg.io/api/games/${selected.id}/additions?key=3c25c0a4c6ef4b98ae8a0af760f18217`
    let req = new Request(url,{
        method:"GET"
    })
    fetch(req)
    .then(resp => resp.json())
    .then(app.gameAddons)
 },

  //Detailed info for the choosen game
  detailedGame:(data)=>{
    
    console.log(data)
        
    //Html container to be filled with the info
    const title_game = document.querySelector(".title-selected") 
    const reactions = document.querySelector(".reactions-selected")
    const description = document.querySelector(".description").innerHTML = data.description_raw  
    const creators = document.querySelector(".creators")
    const bg = document.querySelector(".bg").innerHTML = `<img src="${data.background_image}">`
    const publishers = document.querySelector(".publisher")
    const platforms = document.querySelector(".platform")
    const genres = document.querySelector(".genres")
    const esrb = document.querySelector(".esrb")
    const storesSellers = document.querySelector(".stores")
    const tagsContainer = document.querySelector(".tags")

   


   title_game.innerHTML = `
   <div><h2>${data.name} </h2> <h6>${data.released}</h6></div> `
     
    if(data.esrb_rating != null){
        esrb.innerHTML +=` <p>${data.esrb_rating.name}</p>`
    }
    else{
     return
    }

    for(const rating of data.ratings){
        reactions.innerHTML += `
             <div class="individual-rating"> 
             <h2>${rating.title}</h2>
             <p>${rating.percent}%</p>
             </div>
        `
    }

    for(const genresobj of data.genres){
        genres.innerHTML += `        
             <p>${genresobj.name}</p>
              
        `
    }

    for(const creator of data.developers){
        creators.innerHTML += `
             
             <p>${creator.name}</p>
             
            
        `
    }
    for(const publisher of data.publishers){
        publishers.innerHTML += `
            
             <p>${publisher.name}</p>
          
        `
    }
    for(const devices of data.platforms){
        platforms.innerHTML += `
           
             <p>${devices.platform.name}</p>
          
           
        `
    }
    for(const shop of data.stores){
        console.log(shop.store)
        storesSellers.innerHTML += `
       
        <p>${shop.store.name}</p>

     
        
   `
    }
     for(const tags of data.tags){
        console.log(tags.name)
        tagsContainer.innerHTML += `     
        <p>${tags.name}</p>  
   `
    }
  


    //When the basic game info load,will call this functions to load the rest of the page,this will save bandwidth and load time to the client
   app.getGamesPrint()
   app.getGameSeries()
   app.getGameAddons()
  }
  ,

  //Get all images from api related to the selected game,wich by default will be GTA 
  gamesScreenshots : (data) =>{
    
    

    const containerPrints = document.querySelector(".screenshots")

      data.results.forEach(picture =>{
        containerPrints.innerHTML +=`
        <img src="${picture.image}" class="image-screenshot">
        `
      })


    
  },
  
  
  //Get all games series related to the selected game
  gameSeries : (series) =>{



    const gameSeriesContainer = document.querySelector(".grid")
             
   if(series.results.length != 0){



    series.results.forEach(game =>{
        
        gameSeriesContainer.innerHTML +=`
       <div class="game-series">
       <div class="text-game"><p>${game.name}</p></div>
       <div class="img-game"><img src="${game.background_image}"></div>
       </div>
        `
    })
   }
   else{

    gameSeriesContainer.innerHTML = "<p>No additional series found</p>"

   }
  
    
   

  },
  gameAddons : (addons) =>{

     const gameSeriesContainer = document.querySelector(".grid-editions")   

    if(addons.results.length != 0){
       addons.results.forEach(game =>{
        gameSeriesContainer.innerHTML +=`
       <div class="game-series">
       <div class="text-game"><p>${game.name}</p></div>
       <div class="img-game"><img src="${game.background_image}"></div>
       </div>
        `
    }) 
    }
    else{
        gameSeriesContainer.innerHTML = "<p>No additional DLCs found</p>"
    }

    
    
},




}



   
    

app.init()


