const displayDiv = document.getElementById('displayDiv')
const searchUrl = 'https://api.tvmaze.com/shows/'
const containerDiv = document.querySelector('.containerDiv')
const notificationDiv = document.querySelector('.notificationDiv')
var favourits = []
var detailObject = {}
var favsData =[]

if(localStorage.getItem('favourites')){
    favourits = localStorage.getItem('favourites').split(',').map(e => parseInt(e))
}
function toggleAddFavoutites(e,btn){
    if(favourits.includes(e)){
        const newFavs = favourits.filter(id => id!==e)
        favourits = newFavs
        btn.innerHTML = `Add to my favourits &#10084`
        btn.classList.contains('favouritsBtnRm') && btn.classList.remove('favouritsBtnRm')
        setNotification('Removed from favourites')
        localStorage.setItem('favourites',favourits)
        return
    }
    favourits.push(e)
    btn.innerHTML = `remove from Favourites ❌`
    btn.classList.add('favouritsBtnRm')
    setNotification('Added to favourites')
    localStorage.setItem('favourites',favourits)
}
function toggleAddFavoutitesFav(e){
    if(favourits.includes(e)){
        const newFavs = favourits.filter(id => id!==e)
        favourits = newFavs
        localStorage.setItem('favourites',favourits)
        setNotification('Removed from favourites')
        location.reload()
        return
    }
    favourits.push(e)
    localStorage.setItem('favourites',favourits)
    setNotification('Added to favourites')
    location.reload()
}
function toggleAddFavoutitesDet(e,btn){
    if(favourits.includes(e)){
        const newFavs = favourits.filter(id => id!==e)
        favourits = newFavs
        btn.innerHTML = `<i class="far fa-heart">`
        localStorage.setItem('favourites',favourits)
        setNotification('Removed from favourites')
        return
    }
    favourits.push(e)
    setNotification('Added to favourites')
    btn.innerHTML = `<i class="fas fa-heart">`
    localStorage.setItem('favourites',favourits)
}
function makeADiv(show){

    const btnString = favourits.includes(show.id)? 'remove from Favourites ❌':'Add to my favourits &#10084'
    const classHere = favourits.includes(show.id)? 'favouritsBtnRm':''
    return (`
        <div class='showsDiv shadow'>
            <div class='imgDiv'>
                <img src=${show.image.medium}>
            </div>
            <div class='infoDiv'>
                <p>${show.name}</p> 
                <div>
                    <button onclick='detailsBtnFav(${show.id})' class='detailsBtn'>Details💪</button>  
                </div>
                <div>
                    <button onclick='toggleAddFavoutites(${show.id},this)' class='favouritsBtn ${classHere}'>${btnString}</button>    
                </div>
                <hr>
            </div>
        </div>
    `)
}
async function handleSearchChange({value}){
    const result = await axios.get(`https://api.tvmaze.com/search/shows?q=${value}`)
    const showNames = result.data.map(e => makeADiv(e.show))
    displayDiv.innerHTML = showNames.join('')
}
async function getFavsData(){
    for(let i=0;i<favourits.length;i++){
        const somedata = await axios.get(searchUrl + favourits[i])
        const objForm = {
            img:somedata.data.image.medium,
            name:somedata.data.name,
            id:somedata.data.id
        }
        favsData.push(objForm)
    }
    renderFavrouits()
}
function makeAFavDiv(card){
    return `
        <div class='favCard shadow-lg' style="width: 20%; height: 7% ;boder:1px solid black;border-radius: 30px;">
            <img src='${card.img}' height="200px" style="padding-top: 10px;border-radius: 30px;">
            <h4>
                ${card.name}
            </h4>
            <button onclick='toggleAddFavoutitesFav(${card.id})' class='favButton'><i class="fas fa-heart"></i></button>
            <div>
                <button onclick='detailsBtnFav(${card.id})' class='detailsBtnFav'>Details</button>  
            </div>
        </div>
    `;
}
function renderFavrouits(){
    containerDiv.innerHTML = favsData.map(e => makeAFavDiv(e)).join('')
}
function toggleFavoutitesDet(e){
    toggleAddFavoutitesDet(parseInt(detailObject.id),e)
}
function detailsBtnFav(id){
    localStorage.setItem('dataDetail',id)
    location.href= 'details.html'
}
async function detailsFetch(id){

    const res = await axios.get(searchUrl + id)
    const objToSet = {
        img: res.data.image.medium,
        name: res.data.name,
        id
    }
    return objToSet
}
async function getDetailedItem(){
    const thisId = localStorage.getItem('dataDetail')
    const displayObj = await detailsFetch(thisId)
    const img = document.querySelector('.cardImg')
    const name = document.querySelector('.cardName')
    const btn = document.querySelector('.favButtonDet')
    img.innerHTML = `<img src='${displayObj.img}' >`
    name.innerHTML = displayObj.name
    detailObject = displayObj

    console.log(favourits.includes(parseInt(detailObject.id)))
    console.log(detailObject.id)
    console.log(favourits)

    btn.innerHTML = favourits.includes(parseInt(detailObject.id))? '<i class="fas fa-heart">':'<i class="far fa-heart">'

}

function setNotification(string){
    notificationDiv.innerText = string
    notificationDiv.style.opacity = 1
    setTimeout(()=>{
        notificationDiv.style.opacity = 0
    },1000)
}