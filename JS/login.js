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

    // Username: letters, numbers, and underscores only
let usernameRegex = /^[a-zA-Z0-9_]+$/;

if (!usernameRegex.test(username)) {
    alert("Username can only contain letters, numbers, and underscores (_).");
    event.preventDefault();
    return;
}

// Password: at least 8 chars, one uppercase letter, one number
let passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

if (!passwordRegex.test(password)) {
    alert(
        "Password must be at least 8 characters long and contain at least one capital letter and one number."
    );
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