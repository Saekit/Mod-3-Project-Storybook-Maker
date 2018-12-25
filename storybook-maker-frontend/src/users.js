document.addEventListener("DOMContentLoaded", function(){
fetchUsers()

})
const users_url = `http://localhost:3000/api/v1/users`
function fetchUsers(){
  fetch(users_url)
    .then(res => res.json())
    .then(data => console.log(data))
}
