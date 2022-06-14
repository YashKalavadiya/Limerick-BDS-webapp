import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
    doc,
    setDoc,
    getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqJHXbl4Rq-KYxoGTT4mRwikBCKe6E9Xo",
    authDomain: "limerick-db.firebaseapp.com",
    projectId: "limerick-db",
    storageBucket: "limerick-db.appspot.com",
    messagingSenderId: "43009373528",
    appId: "1:43009373528:web:0e71dcb01a9f807fe3a12d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        window.location.replace("./login.html");
    }
});

const getValbyID = (id) => {
    return document.getElementById(id).value;
};

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("submitbtn").innerText = "Loading...";
    document.querySelector("#submitbtn").disabled = true;
    document.querySelector(".error").style.display = "none";
    const date = new Date();
    const heading = getValbyID("heading");
    const link = getValbyID("link");
    console.log(heading, link);
    if (heading && link) {
        setDoc(doc(db, "news", uuidv4()), {
            heading,
            link,
            date,
        })
            .then((docRef) => {
                // console.log("Document written with ID: ", docRef.id);
                document.querySelector(".success").style.display = "block";
                setTimeout(() => {
                    document.getElementById("submitbtn").innerText = "Submit";
                    document.querySelector("#submitbtn").disabled = false;
                    document.querySelector(".success").style.display = "none";
                }, 1500);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                document.querySelector(".error").innerHTML =
                    "Something went Wrong!!!";
                document.querySelector(".error").style.display = "block";
                document.getElementById("submitbtn").innerText = "Submit";
                document.querySelector("#submitbtn").disabled = false;
            });
    } else {
        document.querySelector(".error").innerHTML =
            "Please Fill all Details!!!";
        document.querySelector(".error").style.display = "block";
        document.querySelector("#submitbtn").disabled = false;
        document.getElementById("submitbtn").innerText = "Submit";
    }
};

document.getElementById("newsForm").addEventListener("submit", handleSubmit);
