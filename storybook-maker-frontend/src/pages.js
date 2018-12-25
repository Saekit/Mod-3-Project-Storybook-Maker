document.addEventListener("DOMContentLoaded", function(){
fetchPages()

})
const pages_url = `http://localhost:3000/api/v1/pages`
function fetchPages(){
  fetch(pages_url)
    .then(res => res.json())
    .then(data => console.log(data))
}
