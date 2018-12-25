document.addEventListener("DOMContentLoaded", function(){
fetchBooks();
clickBook();
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

//shows all the books on the index page
function loadBooks(book){
  let bookName = book.attributes.name
  let user = book.attributes.user.username
  let allBooksUl = document.querySelector('#all-books')
  let bookListLi = document.createElement('li')
  bookListLi.className = 'book'
  debugger

  bookListLi.innerHTML =
  `${bookName} - ${user}
  <div class="modal" data-id="${book.id}">
    <div class="modal-content">
      <div class="d-flex bd-highlight">
        <span class="close">&times;</span>
        <div class="p-2 flex-fill bd-highlight">
          <img src="${book.attributes.pages[0].img_url}">
          <p>${book.attributes.pages[0].content}</p>
          <button type='button' class='previous-btn'>Previous Page</button>
        </div>
        <div class="p-2 flex-fill bd-highlight">
          <img src="${book.attributes.pages[1].img_url}">
          <p>${book.attributes.pages[1].content}</p>
          <button type='button' class='next-btn'>Next Page</button>
        </div>
      </div>
    </div>
  </div>`
  allBooksUl.appendChild(bookListLi)
}

//to open the modal that shows the book's pages
function clickBook(){
  let span = document.getElementsByClassName("close")[0]
  let bookContainer = document.querySelector('#book-container')
  bookContainer.addEventListener('click', function(e){
    if (e.target.classList.contains('book')){
      let book = e.target
        console.log(e.target)
        // debugger
      let modal = book.querySelector('.modal')
      // let modalContent = book.querySelector('.modal-content p')
      modal.style.display = 'block';
      // modalContent.innerText = 'HI'
    }
    if (e.target.classList.contains('close')){
      let modal = e.target.parentNode.parentNode.parentNode
      modal.style.display = 'none';
    }
  })
}

//to open the new book form
function newBookForm(){
  
}










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
