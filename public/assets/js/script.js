class book {
    constructor(image, title, author, genre, description, rating) {
        this.image = image;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
        this.rating = rating;
    }
}

class uI {
    static showBooks() {
        const books = data.getBooks();
        books.forEach((book, index) => {
            uI.addBooksL(book, index); 
        });
    }

    static addBooksL(book, index) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");
        row.dataset.index = index;
        row.innerHTML = `
          <td><img src="${book.image}" alt="Book Cover" style="width:50px;height:50px;"></td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.genre}</td>
          <td>${book.description}</td>
          <td>${book.rating}/10</td>
          <td>
            <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
            <a href="#" class="btn btn-danger btn-sm delete">X</a>
          </td>
        `;
        list.appendChild(row);
    }

    static deleteBooks(element) {
        const row = element.parentElement.parentElement;
        const index = row.dataset.index;
        data.removeBook(index);
        row.remove();
        uI.showAlert("Book removed", "success");
    }

    static clearAllBooks() {
    if (confirm("Are you sure you want to delete all books?")) {
        
        localStorage.removeItem("books");
        uI.refreshList(); 
        uI.showAlert("All books removed", "success");
        
      }
    }

    static editBook(element) {
    const row = element.parentElement.parentElement;
    const index = row.dataset.index;
    const bookf = data.getBooks()[index];

   
    document.querySelector("#editTitle").value = bookf.title;
    document.querySelector("#editAuthor").value = bookf.author;
    document.querySelector("#editGenre").value = bookf.genre;
    document.querySelector("#editDescription").value = bookf.description;
    document.querySelector("#editRating").value = bookf.rating;

    
    const modal = document.querySelector("#editModal");
    modal.style.display = "block";

   
    document.querySelector("#editForm").onsubmit = function (e) {
        e.preventDefault();

        const title = document.querySelector("#editTitle").value;
        const author = document.querySelector("#editAuthor").value;
        const genre = document.querySelector("#editGenre").value;
        const description = document.querySelector("#editDescription").value;
        const rating = document.querySelector("#editRating").value;
        const imageFile = document.querySelector("#editImage").files[0];

        if (!title || !author || !genre || !description || !rating) {
            uI.showAlert("Please fill out all fields", "danger");
            return;
        }

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function () {
                const updatedBook = new book(reader.result, title, author, genre, description, rating);
                data.updateBook(updatedBook, index);
                uI.showAlert("Book updated", "success");
                modal.style.display = "none";
                uI.refreshList();
            };
            reader.readAsDataURL(imageFile);
        } else {
            const updatedBook = new book(book.image, title, author, genre, description, rating);
            data.updateBook(updatedBook, index);
            uI.showAlert("Book updated", "success");
            modal.style.display = "none";
            uI.refreshList();
        }
    };

   
    document.querySelector("#cancelEdit").onclick = function () {
        modal.style.display = "none";
    };

    document.querySelector(".close").onclick = function () {
        modal.style.display = "none";
    };
}
    static refreshList() {
        document.querySelector("#book-list").innerHTML = "";
        uI.showBooks();
    }

    static showAlert(alert, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(alert));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book");
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clean() {
        document.querySelector("#image").value = "";
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#genre").value = "Fantasy";
        document.querySelector("#description").value = "";
        document.querySelector("#rating").value = "";
    }
}

class data {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBooks(book) {
        const books = data.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static updateBook(updatedBook, index) {
        const books = data.getBooks();
        books[index] = updatedBook;
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(index) {
        const books = data.getBooks();
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
    }
}

window.onclick = function(event) {
    const modal = document.querySelector("#editModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", uI.showBooks);

document.querySelector("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
        uI.editBook(e.target);
    } else if (e.target.classList.contains("delete")) {
        uI.deleteBooks(e.target);
    }
});

document.querySelector("#clearBooks").addEventListener("click", () => {
    uI.clearAllBooks(); 
});

document.querySelector(".books").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const genre = document.querySelector("#genre").value;
    const description = document.querySelector("#description").value;
    const imageFile = document.querySelector("#image").files[0];
    const rating = document.querySelector("#rating").value;

    if (!imageFile) {
        uI.showAlert("Please select an image file", "danger");
        return;
    }

    if (title === "" || author === "" || genre === "" || description === "" || rating === "") {
        uI.showAlert("Please enter all values", "danger");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function () {
        const image = reader.result;
        const books = new book(image, title, author, genre, description, rating);
        data.addBooks(books);
        uI.addBooksL(books, data.getBooks().length - 1);
        uI.showAlert("Book added", "success");
        uI.clean();
    };

    reader.onerror = function () {
        uI.showAlert("Error loading image", "danger");
    };
});