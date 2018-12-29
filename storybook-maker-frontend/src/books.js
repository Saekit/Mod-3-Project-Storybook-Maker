document.addEventListener("DOMContentLoaded", function(){
fetchBooks();
loginForm();
newBookForm();
clickBook();
createNewPage();
showButtons();
deletePage();
// let myBooks = document.querySelector("#my-books")
// $(myBooks).on('click', sortMyBooks())
})

//GET request for all the books
const books_url = `http://localhost:3000/api/v1/books`
function fetchBooks(){
  fetch(books_url)
    .then(res => res.json())
    .then(json => {
      json.data.forEach(function(book){
        loadBooks(book)
      })
    })
}

//when click My Books, only show books that belong to user that is logged in
// function sortMyBooks(){
//   fetch(books_url)
//   .then(res => res.json())
//   .then(json => {
//     json.data.forEach(function(book){
//
//     })
//   })
//
// }

//shows all the books on the index page
function loadBooks(book){
  let bookTitle = book.attributes.title
  let user = book.attributes.user.username
  let userId = book.attributes.user.id
  let allBooksUl = document.querySelector('#all-books')
  let bookListLi = document.createElement('li')
  bookListLi.innerHTML =
  `<p class="book-cover" data-toggle="modal" data-target="#exampleModalLong" data-id="${book.id}">${bookTitle} - ${user}</p>`
  allBooksUl.appendChild(bookListLi)
}

//book's id is on the book title, user id is on the hidden input under book title
//to open the modal that shows the book's pages
function clickBook(){
  let bookContainer = document.querySelector('#book-container')
  $(bookContainer).off('click').on('click', function(e){
    if (e.target.classList.contains('book-cover')){
      fetch(books_url)
        .then(res => res.json())
        .then(json => {
          json.data.forEach(function(book){
            let bookTarget = e.target
            let bookId = bookTarget.dataset.id
            let userId = book.attributes.user.id
            let userName = book.attributes.user.username
            if (book.id === bookId){
              let pages = book.attributes.pages
              iteratePages(pages)
            }
            let bookCover = document.querySelector(".book-cover")
            let bookTitle = document.querySelector(".modal-title")
            bookTitle.innerText = e.target.innerText
            bookTitle.dataset.id = bookId
            let bookUser = document.querySelector(".modal-user-id")
            bookUser.dataset.id = userId
          })
        })
    }
  })
}
//shows pages that exist in the database
function iteratePages(pages){
  let modalBody = document.querySelector(".modal-body")
  modalBody.innerHTML = ''
  pages.forEach(function(page){
    let content = page.content
    let image = page.img_url
    let pageP = document.createElement("p")
    pageP.dataset.id = page.id
    pageP.innerHTML = `<img class="book-img" src="${image}"> <br> ${content}
    <br><button type="button" class="btn btn-warning edit-page-btn hidden">Edit Page</button>
    <button class="btn btn-danger delete-btn hidden" type="button">Delete Page</button><br><div class="collapse-hidden-edit"></div>`
    modalBody.append(pageP)
  })
}

//lets users log in or sign up
function loginForm(){
  let loginF = document.querySelector(".login-form")
  let signIn = document.querySelector("#user-input")

  loginF.addEventListener("submit", async function(e){
    e.preventDefault()
    let response = await fetch("http://localhost:3000/api/v1/users")
    let json = await response.json()
    let userInfo = json.data
    userInfo.forEach(function(user){
      if (signIn.value === user.attributes.username) {
        let userIdFromDb = user.id
        let signInForm = document.querySelector("#navbardrop")
        signInForm.innerText = signIn.value
        loginF.parentNode.parentNode.style.display = 'none'
        let userId = document.getElementById("user-id")
        userId.dataset.id = parseInt(userIdFromDb)
        let bookUserId = document.getElementById("book-user-id")
        bookUserId.dataset.id = parseInt(userIdFromDb)
        alert(`Welcome back ${signIn.value}`)
      }
    })
    if (document.querySelector("#navbardrop").innerText === "Sign in"){
      createNewUser(signIn.value)
    }
  })
}

//connected to login form, creates a new user if does not exist
function createNewUser(username){
  fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "username": username
    })
  }).then(res => res.json())
    .then(data => {
      let loginF = document.querySelector(".login-form")
      let signInForm = document.getElementById("navbardrop")
      let userId = document.getElementById("user-id")
      userId.dataset.id = parseInt(data.data.id)
      let bookUserId = document.getElementById("book-user-id")
      bookUserId.dataset.id = parseInt(data.data.id)
      signInForm.innerText = username
      loginF.parentNode.parentNode.style.display = 'none'
      alert(`New user ${username} was created`)
    })
}

//creates a new book
function newBookForm(){
  let bookTitle = document.querySelector("#book-title-input")
  let userId = document.querySelector("#user-id")
  let newBookMake = document.querySelector(".new-book-form")

  newBookMake.addEventListener("submit", function(e){
    e.preventDefault();
    fetch(books_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "title": bookTitle.value,
        "user_id": userId.dataset.id
      })
    }).then(res => res.json())
      .then(book => {
        let bookTitle = book.data.attributes.title
        let user = book.data.attributes.user.username
        let allBooksUl = document.querySelector('#all-books')
        let bookListLi = document.createElement('li')
        bookListLi.innerHTML =
        `<p class="book-cover" data-toggle="modal" data-target="#exampleModalLong" data-id="${book.data.id}">${bookTitle} - ${user}</p>`
        allBooksUl.appendChild(bookListLi)
        let newBookF = document.querySelector(".new-book-form")
        newBookF.reset();
    })
  })
}

//submit form, sends data to the function to create new page
function createNewPage(){
  let pageForm = document.querySelector(".new-page-form")
  $(pageForm).on("submit", function(e){
    e.preventDefault()
    let bookTitle = document.querySelector(".modal-title")
    let image = document.querySelector("#img-url-input").value
    let contentField = document.querySelector("#content-input")
    let content = document.querySelector("#content-input").value
    let bookId = bookTitle.dataset.id
    let hiddenInput = document.querySelector(".modal-user-id")
    let userId = hiddenInput.dataset.id
    addNewPage(image, content, bookId, userId)
  })
}
//adds a new page in a book, persists data in database, optimistic rendering
function addNewPage(image, page_content, bookId, userId){
  let modalBody = document.querySelector(".modal-body")
  let pageP = document.createElement("p")
  pageP.innerHTML = `<img class="book-img" src="${image}"> <br> ${page_content}<br><button type="button" class="btn btn-warning edit-page-btn hidden">Edit Page</button>
  <button class="btn btn-danger delete-btn hidden" type="button">Delete Page</button>`
  modalBody.append(pageP)
  document.querySelector(".new-page-form").reset()

  fetch("http://localhost:3000/api/v1/pages", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "img_url": image,
      "content": page_content,
      "book_id": parseInt(bookId),
      "user_id": parseInt(userId)
    })
  })
}

//when click the edit page button, shows all delete and edit buttons under pages
function showButtons(){
  let editButton = document.querySelector(".edit-book-btn")
  $(editButton).on("click", function(e){
    $("button.delete-btn").toggle()
    $("button.edit-page-btn").toggle()
  })
}

//delete a page from a book
function deletePage(){
  $(".modal-body").on("click", function(e){
    if(e.target.classList.contains("delete-btn")){
      let page = e.target.parentNode
      let pageId = parseInt(page.dataset.id)
      fetch(`http://localhost:3000/api/v1/pages/${pageId}`, {
        method: "DELETE"
      }).then(page.remove())
    }
  })
}

//edit a page in a book
// function editPage(){
//   let editCollapse = $(".collapse-hidden-edit")
// 
// }

//bugs:
  // 1. new page collapse is small
  // 2.






// function drawing(){
// var canvasDiv = document.getElementById('canvasDiv');
// canvas = document.createElement('canvas');
// canvas.setAttribute('width', canvasWidth);
// canvas.setAttribute('height', canvasHeight);
// canvas.setAttribute('id', 'canvas');
// canvasDiv.appendChild(canvas);
// if(typeof G_vmlCanvasManager != 'undefined') {
//   canvas = G_vmlCanvasManager.initElement(canvas);
// }
// //when user clicks canvas, record position, update with redraw
// context = canvas.getContext("2d");
// $('#canvas').mousedown(function(e){
//   var mouseX = e.pageX - this.offsetLeft;
//   var mouseY = e.pageY - this.offsetTop;
//   paint = true;
//   addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
//   redraw();
// });
// //click and drag to draw, if paint is true record it
// $('#canvas').mousemove(function(e){
//   if(paint){
//     addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
//     redraw();
//   }
// });
// //user lets go of their drag then paint will be false
// $('#canvas').mouseup(function(e){
//   paint = false;
// });
// //user leaves the canvas then paint will be false
// $('#canvas').mouseleave(function(e){
//   paint = false;
// })
// //addclick will save the click position
// var clickX = new Array();
// var clickY = new Array();
// var clickDrag = new Array();
// var paint;
// function addClick(x, y, dragging){
//   clickX.push(x);
//   clickY.push(y);
//   clickDrag.push(dragging);
// }
// //redraw function to clear the canvas
// function redraw(){
//   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
//   context.strokeStyle = "#df4b26";
//   context.lineJoin = "round";
//   context.lineWidth = 5;
//   for(var i=0; i < clickX.length; i++){
//     context.beginPath();
//     if(clickDrag[i] && i){
//       context.moveTo(clickX[i-1], clickY[i-1]);
//     } else {
//       context.moveTo(clickX[i]-1, clickY[i]);
//     }
//     context.lineTo(clickX[i], clickY[i]);
//     context.closePath();
//     context.stroke();
//   }
// }
// }
