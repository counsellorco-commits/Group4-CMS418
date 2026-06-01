// --- Validation Scipt for find-patient.html.js ---


document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Populate Dropdowns ---
  
  // Gender Options
  const genderSelect = document.getElementById('s-gender');
  genderSelect.innerHTML = `
    <option value="" disabled selected>Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Modified">Modified</option>
  `;

  // Nigerian HMO Options
  const hmoSelect = document.getElementById('s-hmo');
  const hmos = [
    "Aiico-Multishield HMO", "Anchor HMO", "Avon Healthcare Limited", "Axa-Mansard Health Limited",
    "Clearline International Limited", "Defence Health Maintenance Limited", "HCI Healthcare Limited",
    "Hygeia HMO", "Leadway HMO", "Mediplan Healthcare Limited", "Metro Health HMO",
    "Novo Health Africa", "Prepaid Medicare Services Ltd", "Princeton Health Ltd",
    "Redcare Health Services Limited", "Reliance HMO", "Ronsberger HMO", "Sunu Healthcare Services",
    "Total Health Trust Limited", "United Healthcare International Ltd", "Venus Medicare Ltd"
  ];
  
  hmoSelect.innerHTML = '<option value="" disabled selected>Enter HMO</option>';
  hmos.sort().forEach(hmo => {
    const option = document.createElement('option');
    option.value = hmo;
    option.textContent = hmo;
    hmoSelect.appendChild(option);
  });

  // --- 2. Central Validation Logic ---
  
  function validateInput(input, isValidFn) {
    const container = input.closest('.search-field');
    let errorMsg = container.querySelector('.error-msg');
    
    // Create the error message element dynamically if it doesn't exist
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-msg';
      errorMsg.textContent = 'Invalid entry';
      container.appendChild(errorMsg);
    }

    if (input.value.trim() === '') {
      // Revert to neutral state if the user completely clears the field
      input.classList.remove('is-valid', 'is-invalid');
      errorMsg.style.display = 'none';
    } else if (isValidFn(input.value)) {
      // Valid Entry
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      errorMsg.style.display = 'none';
    } else {
      // Invalid Entry
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      errorMsg.style.display = 'block';
    }
  }

  // --- 3. Field Formatters & Input Listeners ---

  // First Name: Alphabets only, max length 15
  const fName = document.getElementById('s-first');
  fName.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').substring(0, 15);
    validateInput(e.target, val => /^[A-Za-z]{1,15}$/.test(val));
  });

  // Last Name: Alphabets only, max length 20
  const lName = document.getElementById('s-last');
  lName.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').substring(0, 20);
    validateInput(e.target, val => /^[A-Za-z]{1,20}$/.test(val));
  });

  // Date of Birth: MM/DD/YYYY, feasible date enforcement (Current scope: May 2026)
  const dob = document.getElementById('s-dob');
  dob.addEventListener('input', (e) => {
    // Strip non-digits and enforce auto-formatting
    let val = e.target.value.replace(/\D/g, '').substring(0, 8);
    let formatted = '';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += '/' + val.substring(2, 4);
    if (val.length > 4) formatted += '/' + val.substring(4, 8);
    e.target.value = formatted;
    
    validateInput(e.target, (dobStr) => {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dobStr)) return false;
      const parts = dobStr.split('/');
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (month < 1 || month > 12) return false;
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) return false;

      // Ensure no future dates and no dates older than 200 years from May 29, 2026
      const dobDate = new Date(year, month - 1, day);
      const today = new Date(2026, 4, 29); // May 29, 2026
      
      if (dobDate > today) return false; 
      if (year < today.getFullYear() - 200) return false; 

      return true;
    });
  });

  // MRN: Numbers only, max length 10
  const mrn = document.getElementById('s-mrn');
  mrn.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10);
    validateInput(e.target, val => /^\d{1,10}$/.test(val));
  });

  // Phone Number: Exact 13 digits; auto-format as (234) XXX-XXX-XXXX
  const phone = document.getElementById('s-phone');
  phone.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 13);
    let formatted = '';
    
    // Auto-insert syntax markers
    if (val.length > 0) formatted = '(' + val.substring(0, 3);
    if (val.length > 3) formatted += ') ' + val.substring(3, 6);
    if (val.length > 6) formatted += '-' + val.substring(6, 9);
    if (val.length > 9) formatted += '-' + val.substring(9, 13);
    
    e.target.value = formatted;
    validateInput(e.target, val => /^\(\d{3}\) \d{3}-\d{3}-\d{4}$/.test(val));
  });

  // Dropdown Validation Listeners
  genderSelect.addEventListener('change', (e) => validateInput(e.target, val => val !== ''));
  hmoSelect.addEventListener('change', (e) => validateInput(e.target, val => val !== ''));

  // --- 4. Evaluate default HTML Values on Load ---
  
  // Re-evaluates default populated values so borders go green correctly on pageload
  [fName, lName, dob, mrn, phone].forEach(input => {
    if (input.value) {
      input.dispatchEvent(new Event('input'));
    }
  });

});