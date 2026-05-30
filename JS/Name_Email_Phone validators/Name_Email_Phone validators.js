function validateName(name) {
    if (!name.trim()) {
        return "Name is required";
    }
    if (name.trim().length < 2) {
        return "Name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z\s-]+$/.test(name)) {
        return "Name can only contain letters, and hyphens";
    }
    return "";
}

function validateEmail(email) {
    if (!email.trim()) {
        return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Email is invalid";
    }
    return "";
}

function validatePhone(phone) {
    if (!phone.trim()) {
        return "Phone number is required";
    }
    const stripped = phone.replace(/[\s\-()]/g, ""); // Remove all spaces, hyphens, and parentheses from the phone number
    if (!/^\+?[0-9]{7,15}$/.test(stripped)) {
        return "Phone number must be 7–15 digits (with optional + prefix)";
    }
    return "";
}