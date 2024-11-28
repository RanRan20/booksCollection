//class definition

class book{
	constructor(title,author,isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}


class uI{
 static showBooks(){
 	const books = data.getBooks();
 	books.forEach(book =>{
 		uI.addBooksL(book);
 	})

 }
 	
 
 static addBooksL(book){
 const list = document.querySelector("#book-list");
 const row = document.createElement("tr");
 row.innerHTML = `
   <td>${book.title}</td>
   <td>${book.author}</td>
   <td>${book.isbn}</td>
   <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
 `;
 list.appendChild(row);
 }


static deleteBooks(element){
if (element.classList.contains("delete")); {
	element.parentElement.parentElement.remove();
 }
}



static showAlert(alert,className){
	const div = document.createElement("div");
	div.className = `alert alert-${className}`
	div.appendChild(document.createTextNode(alert));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book");
    container.insertBefore(div,form);
    setTimeout(()=>document.querySelector(".alert").remove(),3000);

}

static clean(){
 document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
   document.querySelector("#isbn").value = "";
}

}



class data {
	static getBooks(){
     let books;
     if (localStorage.getItem("books") === null)  {
     	books = [];
     }else{
     	books = JSON.parse(localStorage.getItem("books"));
     }
     return books; 
	}

	static addBooks(book){
    const books = data.getBooks();
    books.push(book);
    localStorage.setItem("books",JSON.stringify(books));
	}

	static removeBook(isbn){
     const books = data.getBooks();
     console.log(isbn);
     books.forEach((book,index)=>{
          if (book.isbn === isbn) {
          	books.splice(index,1);
          }
     });
       localStorage.setItem("books",JSON.stringify(books));
	}
}

//page charge

document.addEventListener("DOMContentLoaded",uI.showBooks())









//event submit
document.querySelector(".books").addEventListener("submit",(e)=>{
 e.preventDefault();

  //obtain values 
 const title = document.querySelector("#title").value;
 const author = document.querySelector("#author").value;
 const isbn = document.querySelector("#isbn").value;

 if (title === "" || author === "" || isbn === "") {
    uI.showAlert("please enter all values","danger");
 }else{
 	const books = new book(title,author,isbn);
 	data.addBooks(books);
 	uI.addBooksL(books);
 	uI.showAlert("book added","success")
 	uI.clean();
 }

});

document.querySelector("#book-list").addEventListener("click",(e)=>{
	uI.deleteBooks(e.target);
	data.removeBook(e.target.parentElement.previousElementSibling.textContent);
	uI.showAlert("books deleted","success");

});