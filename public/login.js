const login = document.getElementById("login-button");
const mail = document.getElementById("email");
const passwrd = document.getElementById("password");
const url = "http://localhost:3000";

const createAccountLink = document.getElementById("create-account-link");
const signupModal = document.getElementById("signup-modal");
const closeSignupModal = document.getElementById("close-signup-modal");
const signupForm = document.getElementById("signupForm");

createAccountLink.addEventListener("click", (e) => {
  e.preventDefault();
  signupModal.classList.add("active");
});

closeSignupModal.addEventListener("click", () => {
  signupModal.classList.remove("active");
});

signupModal.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && signupModal.classList.contains("active")) {
    signupModal.classList.remove("active");
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("signup-firstname").value.trim();
  const lastName = document.getElementById("signup-lastname").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password",
  ).value;

  if (!firstName || !email || !password) {
    alert("First name, email, and password are required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const signupResponse = await fetch(`${url}/signup/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!signupResponse.ok) {
      const errData = await signupResponse.json();
      alert(errData.message || errData.error || "Signup failed");
      return;
    }

    const data = await signupResponse.json();
    alert(data.message || "Account created successfully! Please login.");

    // Close modal and clear form
    signupModal.classList.remove("active");
    signupForm.reset();
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong. Try again.");
  }
});

login.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = mail.value.trim();
  const password = passwrd.value;

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  try {
    /*
        1. user credentials sent and is authenticated and token is coming 
    */
    const loginresponse = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!loginresponse.ok) {
      const errData = await loginresponse.json();
      alert(errData.message || errData.error || "Login failed");
      return;
    }

    /*
        2. now that we have received the token we will now call our profile api to verify the user and get the user
    */

    const profileresponse = await fetch(`${url}/profile`, {
      method: "GET",
      credentials: "include",
    });

    if (!profileresponse.ok) {
      alert("Authentication failed!!");
      return;
    }

    const user = await profileresponse.json();
    console.log("Logged in:", user);

    /*
        3. clear form and redirect
    */

    mail.value = "";
    passwrd.value = "";
    window.location.href = "index.html";
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Try again.");
  }
});
