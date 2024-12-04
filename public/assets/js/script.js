function toggleTheme() {
    const body = document.body;
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");

    if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme"); 
        sunIcon.style.display = "inline";   
        moonIcon.style.display = "none";

        localStorage.setItem("theme", "light");   
    } else {
        body.classList.add("dark-theme");   
        sunIcon.style.display = "none";      
        moonIcon.style.display = "inline";

        localStorage.setItem("theme", "dark");   
    }
}

window.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-theme");
        document.getElementById("sunIcon").style.display = "none";
        document.getElementById("moonIcon").style.display = "inline";
    } else {
        document.getElementById("sunIcon").style.display = "inline";
        document.getElementById("moonIcon").style.display = "none";
    }
});

document.querySelector("#themeToggle").addEventListener("click", toggleTheme);
document.querySelector("#sunIcon").addEventListener("click", toggleTheme);
document.querySelector("#moonIcon").addEventListener("click", toggleTheme);

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


//tests

// Test 1
function testToggleTheme() {
    
    const sunIcon = document.getElementById("sunIcon");
    sunIcon.click();
    
    
    const body = document.body;
    if (body.classList.contains("dark-theme")) {
        console.log("Test Passed -  Theme changed to dark.");
    } else {
        console.log("Test Failed - Theme did not change to dark.");
    }

    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        console.log("Test Passed - LocalStorage updated with dark theme.");
    } else {
        console.log("Test Failed - LocalStorage did not save dark theme.");
    }
}



// Test 2
function testAddBook() {
    const mockBook = new book(
        "test-image",
        "Test Book",
        "Test Author",
        "Fantasy",
        "This is a test description.",
        "8"
    );

  
    data.addBooks(mockBook);

    const books = data.getBooks();
    if (books.length > 0 && books[books.length - 1].title === "Test Book") {
        console.log("Test Passed - Book added successfully.");
    } else {
        console.log("Test Failed - Book was not added.");
    }
}

//test 3
function testDeleteBook() {
  
    const mockBook = new book(
        "test-image",
        "Test Book",
        "Test Author",
        "Fantasy",
        "This is a test description.",
        "8"
    );
    data.addBooks(mockBook);

    const books = data.getBooks();
    const initialBookCount = books.length;

    
    data.removeBook(0);

    const updatedBooks = data.getBooks();
    if (updatedBooks.length === initialBookCount - 1) {
        console.log("Test Passed - Book deleted successfully.");
    } else {
        console.log("Test Failed - Book was not deleted.");
    }
}


// Test 4
function testUpdateBook() {
   
    const mockBook = new book(
        "test-image",
        "Test Book",
        "Test Author",
        "Fantasy",
        "This is a test description.",
        "8"
    );
    data.addBooks(mockBook);

    const books = data.getBooks();
    const index = books.length - 1;

   
    const updatedBook = new book(
        "new-test-image",
        "Updated Book",
        "Updated Author",
        "Adventure",
        "This is an updated description.",
        "9"
    );

    
    data.updateBook(updatedBook, index);

    const updatedBooks = data.getBooks();
    if (
        updatedBooks[index].title === "Updated Book" &&
        updatedBooks[index].author === "Updated Author"
    ) {
        console.log("Test Passed - Book updated successfully.");
    } else {
        console.log("Test Failed - Book was not updated.");
    }
}

// Test 5
function testClearAllBooks() {
    
    data.addBooks(new book("image/images.jpeg", "bookXd", "Authors", "Fantasy", "this is incredible", "7"));
    data.addBooks(new book("image/images.jpeg", "bookw", "authorz", "Sci-Fi", "that was incredible", "8"));

    
    uI.clearAllBooks();

    const books = data.getBooks();
    if (books.length === 0) {
        console.log("Test Passed - All books was removed.");
    } else {
        console.log("Test Failed - Books were not removed.");
    }
}

testToggleTheme();
testAddBook();
testDeleteBook();
testUpdateBook();
testClearAllBooks();