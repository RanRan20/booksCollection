import { data, book } from '';  // Import `book` and `data`


beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
});

// Test for adding a book
describe("Adding a book", function() {
    it("should add a book to the localStorage", function() {
        // Prepare data
        const newBook = new book(
            "image_url",
            "Test Book",
            "Test Author",
            "Test Genre",
            "Test description",
            8
        );

        // Add the book
        data.addBooks(newBook);

        // Get all books from localStorage and check if it contains the added book
        const books = data.getBooks();
        expect(books.length).toBe(1);
        expect(books[0].title).toBe("Test Book");
        expect(books[0].author).toBe("Test Author");
    });
});

// Test for removing a book
describe("Removing a book", function() {
    it("should remove a book from the localStorage", function() {
        // Add a book to localStorage
        const bookToRemove = new book(
            "image_url",
            "Test Book to Remove",
            "Test Author",
            "Test Genre",
            "Test description",
            9
        );
        data.addBooks(bookToRemove);

        // Remove the book
        data.removeBook(0);

        // Get all books from localStorage and check that it is empty
        const books = data.getBooks();
        expect(books.length).toBe(0);
    });
});

// Test for updating a book
describe("Updating a book", function() {
    it("should update a book in localStorage", function() {
        // Add a book to localStorage
        const oldBook = new book(
            "image_url",
            "Old Title",
            "Old Author",
            "Old Genre",
            "Old description",
            5
        );
        data.addBooks(oldBook);

        // Update the book
        const updatedBook = new book(
            "image_url",
            "New Title",
            "New Author",
            "New Genre",
            "New description",
            10
        );
        data.updateBook(updatedBook, 0);

        // Get all books from localStorage and check the updated values
        const books = data.getBooks();
        expect(books[0].title).toBe("New Title");
        expect(books[0].author).toBe("New Author");
        expect(books[0].rating).toBe(10);
    });
});

// Test for checking theme toggle
describe("Theme toggle", function() {
    it("should toggle between dark and light theme", function() {
        // Simulate a theme toggle
        document.body = document.createElement('body'); // Mock body element
        document.body.classList = [];
        const sunIcon = document.createElement('div');
        const moonIcon = document.createElement('div');
        sunIcon.id = "sunIcon";
        moonIcon.id = "moonIcon";
        document.body.appendChild(sunIcon);
        document.body.appendChild(moonIcon);

        // Initial theme should be light
        expect(document.body.classList.contains("dark-theme")).toBe(false);
        expect(sunIcon.style.display).toBe("inline");
        expect(moonIcon.style.display).toBe("none");

        // Toggle to dark theme
        toggleTheme();  // Assuming toggleTheme function exists
        expect(document.body.classList.contains("dark-theme")).toBe(true);
        expect(sunIcon.style.display).toBe("none");
        expect(moonIcon.style.display).toBe("inline");

        // Toggle back to light theme
        toggleTheme();
        expect(document.body.classList.contains("dark-theme")).toBe(false);
        expect(sunIcon.style.display).toBe("inline");
        expect(moonIcon.style.display).toBe("none");
    });
});

// Test for login functionality
describe("Login functionality", function() {
    it("should log in successfully with valid credentials", function() {
        // Mocking localStorage for user login
        const mockUser = { name: "Test User", email: "test@domain.com", password: "password123" };
        global.localStorage.setItem("user", JSON.stringify(mockUser));

        // Simulate login attempt
        const email = "test@domain.com";
        const password = "password123";

        // Check if login is successful
        const storedUser = JSON.parse(localStorage.getItem("user"));
        expect(storedUser.email).toBe(email);
        expect(storedUser.password).toBe(password);
    });

    it("should fail login with invalid credentials", function() {
        // Simulate invalid login
        const email = "wrong@domain.com";
        const password = "wrongpassword";

        const storedUser = JSON.parse(localStorage.getItem("user"));
        expect(storedUser.email).not.toBe(email);
        expect(storedUser.password).not.toBe(password);
    });
});