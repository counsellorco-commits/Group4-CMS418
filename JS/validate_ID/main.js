// National ID validation

// Nigeria's NIN
// using RegEx ^\d{11}$

let nin;

function validateNIN(nin){
    // remove spaces
    nin = nin.trim();

    // for the RegEx
    const pattern = /^\d{11}$/;
    if (pattern.test(nin)){
        return "valid NIN format";
    }else {
        return "invalid NIN Format"
    }

    if (nin = 11111111111) {
        return "fake NIN";
    }

    if (!nin) {
        return "field should not be empty";
    }
}

console.log(validateNIN("11234563779"));
