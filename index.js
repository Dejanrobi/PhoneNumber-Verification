//FIREBASE CONFIGURATION

//importing firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js"
import { getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"

const firebaseApp = initializeApp({
  //configuration details
  apiKey: "AIzaSyBy0VfOm7b_hltzschpGsZgtGEPiC1aw0w",
  authDomain: "phone-number-auth-b675e.firebaseapp.com",
  projectId: "phone-number-auth-b675e",
  storageBucket: "phone-number-auth-b675e.appspot.com",
  messagingSenderId: "298377313654",
  appId: "1:298377313654:web:29b9fb47f017590e948e57",
  measurementId: "G-KVJ7C11LLD"
})



//initializing auth
const auth = getAuth(firebaseApp)

// onAuthStateChanged(auth, user=>{
//   if(user!=null){
//     console.log("Logged in!")
//   }else{
//     console.log("No User");
//   }
// })

//MAKING THE INPUT LOCATION AWARE

//INITIALIZING THE PLUGIN TO GIVE US THE COUNTRY CODES
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

//A function to add the form submit
const info = document.querySelector(".alert-info");
const submitForm = document.querySelector("#login");
const verifyDiv = document.querySelector(".verify-div");
const verifyForm = document.querySelector(".verify-form");



//INVISIBLE RECAPTURE

const generateRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier('recapture-container', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  }, auth);

}



submitForm.addEventListener("submit", (e) => {
  e.preventDefault()
  //console.log("Form submitted")

  const phoneNumber = phoneInput.getNumber(); //phoneInput.getNumber() is the plugin code that converts selected country code and user input into the international format
  info.style.display = "";
  info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`;

  //Opening the OTP Popup
  verifyDiv.classList.add("display-div");

  //Adding the recaptcha verifier
  //INVISIBLE RECAPTCHA
  generateRecaptcha()

  let appVerifier = window.recaptchaVerifier;
  //After the recaptcha is generated, we will then sign in the user using the phone number that we have generated above

  //SIGN IN WITH PHONE NUMBER
  signInWithPhoneNumber(auth, phoneNumber, appVerifier).then((confirmationResult) => {
    window.confirmationResult = confirmationResult
    
    alert("Verification code sent")
  }).catch((e) => {
    const eMessage = e.message
    alert(eMessage)
  })

})



verifyForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const verificationCode = document.querySelector(".verification-code").value
  // console.log(verificationCode)

  //VERIFY OTP
  //you can make a variable global through e.g. window.confirmationResult
  let confirmationResult = window.confirmationResult;
  confirmationResult.confirm(verificationCode).then((result) => {
    // User signed in successfully.
    const user = result.user;
    // ...
    alert("User signed in Successfully")
  }).catch((error) => {
    // User couldn't sign in (bad verification code?)
    // ...
    const eMessage = error.message
    alert(eMessage)
  });
})

// //Including the Recaptcha widget
// window.recaptchaVerifier = new RecaptchaVerifier('recapture-container', {
//   'size':'normal',
//   'callback':(response)=>{
//     console.log("Recapture solved")
//   },
//   'expired-callback':()=>{
//     console.log("Recaptcha expired")
//   }
// }, auth);

// const recaptureId = document.querySelector("#recapture-container")
// recaptchaVerifier.render().then((widgetId)=>{
//   window.recaptureId
// })