var firebaseConfig = {
    apiKey: "AIzaSyBV9rQNhxkKV6a62CDgKU2IiatGxV_572Q",
    authDomain: "unifi-customer-handler.firebaseapp.com",
    databaseURL: "https://unifi-customer-handler.firebaseio.com",
    projectId: "unifi-customer-handler",
    storageBucket: "unifi-customer-handler.appspot.com",
    messagingSenderId: "126635632868",
    appId: "1:126635632868:web:d2c7f9bc8b699759f124f1",
    measurementId: "G-7PE19PG761"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const txtusername = document.getElementById('username');
const txtpassword = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const messages = document.getElementById('messages');
loginButton.addEventListener('click', e => {
    const username = txtusername.value;
    const password = txtpassword.value;
    const auth = firebase.auth();
    //sign in
    const promise = auth.signInWithEmailAndPassword(username,password);
    promise.catch(e => {
        console.log(e.message)
        while(messages.firstChild){
            messages.removeChild(messages.firstChild);
          }

            const li = document.createElement('li');
            li.textContent = e.message;
            messages.appendChild(li);
            messages.style.display = "block";
    });
})



firebase.auth().onAuthStateChanged(firebaseUser => {
   
    if(firebaseUser){

        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            const request = new XMLHttpRequest();
            request.onload = () => { 
                let responseObject = null;
                try{
                  responseObject = JSON.parse(request.responseText);
                }catch{
                  console.error('could not parse JSON');
                }
        
                if(responseObject){
                    console.log(responseObject.userType)
                  if(responseObject.userType == 'agent'){
                    window.location.replace("./agent/register.html");
                  } else if (responseObject.userType == 'admin'){
                    window.location.replace("./admin/verify.html");
                } else if (responseObject.userType == 'principal'){
                  window.location.replace("./principal/verify.html");
                }else{
                    console.error("error usertype not exist");
                }
                }
            }
            request.open('post', 'https://asia-east2-unifi-customer-handler.cloudfunctions.net/api/user/type');
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Authorization', `Bearer ${idToken}`);
            request.send();

            // ...
          }).catch(function(error) {
              console.error(error);
          });

    
    }else{
      //  window.location.replace("./index.html");
    }
})
