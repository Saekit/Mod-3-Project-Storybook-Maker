document.addEventListener("DOMContentLoaded", function(){
fetchBooks();
loginForm();
newBookForm();
clickBook();
addNewPage();
showButtons();
deletePage();
editPage();
searchBook();
showBookBtns();
deleteBook();
editTitle();
myBooks()
$(".search-book").on("input", searchBook);
})

//search for anything included within the book cover, connected to the input at the top
function searchBook(){
  let search = document.querySelector(".search-book").value.toLocaleLowerCase()
  let allBooks = document.querySelectorAll("#all-books li p")
  let booksArray = Array.from(allBooks)

  booksArray.forEach(function(book, index){
    if (book.innerText.toLocaleLowerCase().includes(search)){
      allBooks[index].parentElement.style.display = 'block';
    }else{
      allBooks[index].parentElement.style.display = 'none';
    }
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
        signInForm.dataset.id = userIdFromDb

        $(".new-book-li").show();
        $(".modal-footer").show();
        $(".edit-book-li").show();
        $(".my-books-btn").show();
        alert(`Welcome back ${signIn.value}`)
        // debugger
        document.querySelector(".edit-book-title-a").dataset.id = userIdFromDb
        document.querySelector(".my-books-a").dataset.id = userIdFromDb
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
      signInForm.dataset.id = data.data.id
      loginF.parentNode.parentNode.style.display = 'none'
      $(".modal-footer").show();
      $(".new-book-li").show();
      $(".edit-book-li").show();
      $(".my-books-btn").show();
      alert(`New user ${username} was created`)
      document.querySelector(".edit-book-title-a").dataset.id = parseInt(data.data.id)
      document.querySelector(".my-books-a").dataset.id = data.data.id
    })
}


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

//shows all the books on the index page
function loadBooks(book){
  let bookTitle = book.attributes.title
  let user = book.attributes.user.username
  let userId = book.attributes.user.id
  let allBooksUl = document.querySelector('#all-books')
  let bookListLi = document.createElement('li')
  bookListLi.innerHTML =
  `<p class="book-cover" data-toggle="modal" data-target="#exampleModalLong" data-id="${book.id}">${bookTitle} - ${user}<input type="hidden" class="user-id" data-id="${userId}"></p>

  <div class="btn-group btn-group-sm" role="group" data-id="${userId}">
  <button type="button" class="btn btn-warning edit-book-title" data-id="${book.id}" type="button" data-toggle="collapse" data-target="#collapse-edit-${book.id}" aria-expanded="false" aria-controls="collapseExample">Edit Title</button>
  <button type="button" class="btn btn-danger delete-book">Delete Book</button>
  </div>

  <div class="edit-title-container">
    <div class="collapse" id="collapse-edit-${book.id}">
      <form class="edit-title-form" data-id="${book.id}">
        <input class="form-control mr-sm-2 edit-title-input" type="text" name="title">
        <button class="btn btn-outline-success my-2 my-sm-0 title-btn" type="submit">Submit</button>
      </form>
    </div>
  </div>
  `
  allBooksUl.appendChild(bookListLi)
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
        `<p class="book-cover" data-toggle="modal" data-target="#exampleModalLong" data-id="${book.data.id}">${bookTitle} - ${user}<input type="hidden" class="user-id" data-id="${userId.dataset.id}"></p>

        <div class="btn-group btn-group-sm" role="group" data-id="${userId.dataset.id}">
        <button type="button" class="btn btn-warning edit-book-title" data-id="${book.data.id}" type="button" data-toggle="collapse" data-target="#collapse-edit-${book.data.id}" aria-expanded="false" aria-controls="collapseExample">Edit Title</button>
        <button type="button" class="btn btn-danger delete-book">Delete Book</button>
        </div>

        <div class="edit-title-container">
          <div class="collapse" id="collapse-edit-${book.data.id}">
            <form class="edit-title-form" data-id="${book.data.id}">
              <input class="form-control mr-sm-2 edit-title-input" type="text" name="title">
              <button class="btn btn-outline-success my-2 my-sm-0 title-btn" type="submit">Submit</button>
            </form>
          </div>
        </div>
        `
        allBooksUl.appendChild(bookListLi)
        let newBookF = document.querySelector(".new-book-form")
        newBookF.reset();
        alert(`${bookTitle} was created!`)
    })
  })
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
              document.querySelector(".modal-body").dataset.id = book.id
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
    pageP.className = "page-img-content"
    pageP.innerHTML = `<img class="book-img" src="${image}"> <br> <p class="page-content">${content}</p>
    <button class="btn btn-danger delete-btn hidden" type="button">Delete Page</button>
    <button data-id="${page.id}" type="button" class="btn btn-warning edit-page-btn hidden" data-toggle="collapse" data-target="#collapse-edit-${page.id}" aria-expanded="false" aria-controls="collapseExample">Edit Page</button>
    <br>
    <div class="card edit-form-container" data-parent="#all-page-holder">
      <div class="collapse card-body" id="collapse-edit-${page.id}">
        <form class="edit-page-form" data-id="${page.id}">
          <input class="form-control mr-sm-2 edit-img-url-input" type="text" name="img-url">
          <textarea class="form-control edit-content-input" rows="5" name="input-content"></textarea>
          <button class="btn btn-outline-success my-2 my-sm-0 create-page-btn" type="submit">Submit</button>
        </form>
      </div>
    </div>
    `
    modalBody.append(pageP)
  })
}

//adds a new page in a book, persists data in database
function addNewPage(){
  let pageForm = document.querySelector(".new-page-form")
  $(pageForm).on("submit", function(e){
    e.preventDefault()
    let bookTitle = document.querySelector(".modal-title")
    let image = document.querySelector("#img-url-input").value
    let contentField = document.querySelector("#content-input")
    let page_content = document.querySelector("#content-input").value
    let bookId = bookTitle.dataset.id
    let hiddenInput = document.querySelector(".modal-user-id")
    let userId = hiddenInput.dataset.id

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
    }).then(res => res.json())
      .then(page => {
        let modalBody = document.querySelector(".modal-body")
        let pageP = document.createElement("p")


        pageP.className = "page-img-content"
        pageP.innerHTML =
        `<img class="book-img" src="${image}"> <br> <p class="page-content">${page_content}</p>
        <button class="btn btn-danger delete-btn hidden" type="button">Delete Page</button>
        <button data-id="${page.data.id}" type="button" class="btn btn-warning edit-page-btn hidden" data-toggle="collapse" data-target="#collapse-edit-${page.data.id}" aria-expanded="false" aria-controls="collapseExample">Edit Page</button>
        <br>
        <div class="card edit-form-container" data-parent="#all-page-holder">
          <div class="collapse card-body" id="collapse-edit-${page.data.id}">
            <form class="edit-page-form" data-id="${page.data.id}">
              <input class="form-control mr-sm-2 edit-img-url-input" type="text" name="img-url">
              <textarea class="form-control edit-content-input" rows="5" name="input-content"></textarea>
              <button class="btn btn-outline-success my-2 my-sm-0 create-page-btn" type="submit">Submit</button>
            </form>
          </div>
        </div>`
        modalBody.append(pageP)
        pageForm.reset()
      })
  })
}


//edit a page in a book
function editPage(){
  let modalBody = $(".modal-body")
  $(modalBody).on("click", function(e){

    let pageId1 = e.target.parentNode.dataset.id
    let editBtnId = e.target.dataset.id
    if(e.target.classList.contains("edit-page-btn") && (pageId1 === editBtnId)){

      let parent = e.target.parentNode
      let pageImage = parent.querySelector(".book-img").src
      let pageContent = parent.querySelector(".page-content").innerText

      let bookId = parent.parentNode.dataset.id
      let pageId = parent.dataset.id
      let userId = parent.parentNode.parentNode.querySelector(".modal-user-id").dataset.id

      let imgInput = parent.querySelector(".edit-img-url-input")
      let contentInput = parent.querySelector(".edit-content-input")
      imgInput.value = pageImage
      contentInput.value = pageContent
      // debugger
      fetchEditPage(parent, bookId, pageId, userId)
    }
  })
}

//on submit will update the database , optimistic rendering
function fetchEditPage(parent, bookId, pageId, userId){
  let editForm = parent.querySelector(".edit-page-form")
  $(editForm).on("submit", function(e){
    e.preventDefault()
    let pageImage = parent.querySelector(".book-img")
    let pageContent = parent.querySelector(".page-content")

    pageImage.src = parent.querySelector(".edit-img-url-input").value
    pageContent.innerText = parent.querySelector(".edit-content-input").value

    fetch(`http://localhost:3000/api/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "book_id": bookId,
        "user_id": userId,
        "page_id": pageId,
        "img_url": parent.querySelector(".edit-img-url-input").value,
        "content": parent.querySelector(".edit-content-input").value
      })
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

//toggles the edit and delete button under the book covers
function showBookBtns(){
  let userId = document.querySelector("#navbardrop")
  let editBookBtn = document.querySelector(".edit-book-title-a")
  let editTitleBtn = $(".btn-group")
  $(editBookBtn).on("click", function(e){
    document.querySelectorAll(`.book-cover input[data-id="${userId.dataset.id}"]`).forEach(function(book){
      let buttonDiv = book.parentNode.parentNode
      let editBtn = buttonDiv.querySelector(".edit-book-title")
      let deleteBtn = buttonDiv.querySelector(".delete-book")
      $(editBtn).toggle()
      $(deleteBtn).toggle()
    })
  })
}

// deletes book
function deleteBook(){
  $("#all-books").on("click", function(e){
    if (e.target.classList.contains("delete-book")){
      let book = e.target.parentNode.parentNode
      let bookId = parseInt(book.querySelector("p").dataset.id)
      let result = confirm("Are you sure you want to delete this book?");
      if (result) {
        fetch(`http://localhost:3000/api/v1/books/${bookId}`, {
          method: "DELETE"
        }).then(book.remove())
      }
    }
  })
}

// clicking edit under the book will show a collapse that will allow you to change the book title

function editTitle(){
  $("#all-books").on("click", function(e){
    let bookId = e.target.parentNode.parentNode.querySelector("p").dataset.id
    let editBtnId = e.target.dataset.id
    if(e.target.classList.contains("edit-book-title") && (bookId === editBtnId)){
      let parent = e.target.parentNode.parentNode
      let title = parent.querySelector("p")
      let userId = parent.querySelector(".user-id").dataset.id
      let titleInput = parent.querySelector(".edit-title-input")
      titleInput.value = title.innerText
      fetchBookTitle(parent, userId, bookId)
    }
  })
}

function fetchBookTitle(parent, userId, bookId){
  let editForm = parent.querySelector(".edit-title-form")
  $(editForm).on("submit", function(e){
    e.preventDefault()
    let bookTitle = parent.querySelector("p")
    bookTitle.innerText = parent.querySelector(".edit-title-input").value
    fetch(`http://localhost:3000/api/v1/books/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "book_id": bookId,
        "user_id": userId,
        "title": parent.querySelector(".edit-title-input").value
      })
    })
  })
}

//shows only the books that belong to the signedin user, toggles All Books
function myBooks(){
  $(".my-books-btn").off('click').on('click', function(){
    let userName = document.querySelector(".user-signin").innerText.replace(/\s/g, "")
    let allBooks = document.querySelectorAll("#all-books li p")
    let booksArray = Array.from(allBooks)

      if (document.querySelector(".my-books-a").innerText === "My Books") {
        booksArray.forEach(function(book, index){
          if (book.innerText.includes(userName)){
            allBooks[index].parentElement.style.display = 'block';
            document.querySelector(".my-books-a").innerText = "All Books"
          } else {
            allBooks[index].parentElement.style.display = 'none';
            document.querySelector(".my-books-a").innerText = "All Books"
          }
          })
      } else {
        booksArray.forEach(function(book, index){
          allBooks[index].parentElement.style.display = 'block';
          document.querySelector(".my-books-a").innerText = "My Books"
        })
      }
  })
}








//bugs:
  // 1.
  // 2. name of book title editor shows in the title along with original creator after refresh
  // 3. after creating a new page, inputs do not populate
  // 4.
  // 5. sometimes cannot edit older pages after making a new one

  //Better fixes:
  // 1. have the modal pop up after you create a new book
  // 2. hide the image if there is none, only show the content
