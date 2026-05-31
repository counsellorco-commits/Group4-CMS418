// Get the form
let form = document.getElementById("loginForm");

// Listen for form submission
form.addEventListener("submit", function(event) {

    // Get username value
    let username = document.getElementById("username").value;

    // Get password value
    let password = document.getElementById("password").value;

    // Check username
    if (username.trim() === "") {
        alert("Username is required");
        event.preventDefault();
        return;
    }

    // Check password
    if (password.trim() === "") {
        alert("Password is required");
        event.preventDefault();
        return;
    }

    // Check username length
    if (username.length < 3) {
        alert("Username must be at least 3 characters");
        event.preventDefault();
        return;
    }

    // Check password length
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        event.preventDefault();
        return;
    }

    // Success message
    alert("Did you add login functionality?!");

});

// Password toggle

let toggle = document.getElementById("pwd-toggle");
let passwordField = document.getElementById("password");
toggle.addEventListener("click", function() {

    if (toggle.seen==false) {
        passwordField.type = "text";
	    toggle.seen=true;
        toggle.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="#9ca3af" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`;

    } else {
	    passwordField.type = "password";
	    toggle.seen=false;
        toggle.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>`;
    }

});

/* let toggle = document.getElementById("pwd-toggle");

let passwordInput = document.querySelector(".pwd-password");

toggle.addEventListener("change", function() {

    if (toggle.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }

}); */