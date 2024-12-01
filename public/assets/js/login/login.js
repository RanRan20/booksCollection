document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
});

document.getElementById("show-signup").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
});


document.getElementById("signup").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name = document.querySelector("#signup .name").value;
    const email = document.querySelector("#signup .email").value;
    const password = document.querySelector("#signup .password").value;
    
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    
    alert("Registration successful! Redirecting to login...");
    
   
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
});


document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const email = document.querySelector("#login .email").value;
    const password = document.querySelector("#login .password").value;
    
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert("Login successful! Redirecting to book collection...");
        window.location.href = "../index.html"; 
    } else {
        alert("Invalid login credentials!");
    }
});