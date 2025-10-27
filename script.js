// --- Global Initialization ---

// Set the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Get the user's preferred theme from local storage or default to 'dark'
const storedTheme = localStorage.getItem('theme') || 'dark';

/**
 * Applies the stored theme to the body and updates the button text.
 * @param {string} theme - The theme name ('dark' or 'light').
 */
function applyTheme(theme) {
    const body = document.body;
    const themeBtn = document.getElementById("themeBtn");

    if (theme === 'light') {
        body.classList.add('light-mode');
        themeBtn.textContent = 'Dark Theme';
    } else {
        body.classList.remove('light-mode');
        themeBtn.textContent = 'Light Theme';
    }
    localStorage.setItem('theme', theme);
}

// Apply theme on load
applyTheme(storedTheme);

// --- Theme Switcher Logic ---
document.getElementById("themeBtn").addEventListener("click", () => {
  const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});


// --- Fetch and Display Users (API Integration) ---
fetch("https://randomuser.me/api/?results=3&inc=name,email,picture")
  .then(res => {
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    let output = "";
    data.results.forEach(user => {
      // Using the more generic 'user-card' class for better styling
      output += `
        <div class="col-sm-6 col-md-4">
          <div class="user-card text-center h-100 d-flex flex-column align-items-center justify-content-center">
            <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" class="mb-3">
            <div>
              <h5 class="mb-0">${user.name.first} ${user.name.last}</h5>
              <p class="text-muted small">${user.email}</p>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById("userData").innerHTML = output;
  })
  .catch(error => {
    console.error("Error fetching user data:", error);
    // Display a user-friendly message if the API fails
    document.getElementById("userData").innerHTML = `<p class="text-center text-muted">Could not load users: ${error.message}</p>`;
  });


// --- Contact Form Validation ---
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formMsg = document.getElementById("formMsg");

  // Simple validation checks
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Basic email regex
  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  if (name && isValidEmail && message) {
    // --- Production Simulation ---
    // In a real application, you would send this data to a server here (e.g., using fetch POST).
    
    // Simulate successful form submission
    formMsg.textContent = "Thank you! Your message has been received.";
    formMsg.style.color = "var(--accent1)"; // Use accent color for success
    
    // Reset form after a small delay
    setTimeout(() => {
        e.target.reset();
        formMsg.textContent = "";
    }, 3000);

  } else {
    // Client-side error handling
    formMsg.textContent = "Please ensure all fields are filled correctly (Name, valid Email, and Message).";
    formMsg.style.color = "red";
    
    // Simple visual feedback for invalid fields (optional but good UX)
    [nameInput, emailInput, messageInput].forEach(input => {
        if (!input.value.trim() || (input.id === 'email' && !isValidEmail)) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
  }
});