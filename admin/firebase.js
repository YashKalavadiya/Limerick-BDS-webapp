import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
	doc,
	setDoc,
	getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

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
const storage = getStorage();

let imageUrl;
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

const uploadImage = () => {
	const file = document.querySelector("#image").files[0];
	document.querySelector(".info").style.display = "block";
	document.querySelector("#submit-btn").disabled = true;
	const name = new Date() + "-" + file.name;
	const metadata = {
		contentType: file.type,
	};
	const imgRef = ref(storage, `workshops/${new Date()}-${file.name}`);
	const imageRef = imgRef._location.path;
	uploadBytes(imgRef, file)
		.then((snapshot) => getDownloadURL(snapshot.ref))
		.then((url) => {
			imageUrl = url;
			document.querySelector(".info").style.display = "none";
			document.querySelector(".success").innerHTML =
				"Image Uploaded Successfully!!!";
			document.querySelector(".success").style.display = "block";
			document.querySelector("#submit-btn").disabled = false;
			setTimeout(() => {
				document.querySelector(".success").style.display = "none";
				document.querySelector(".success").innerHTML =
					"Workshop Details Added Successfully!!!";
			}, 1500);
		})
		.catch((error) => {
			console.log(error);
			document.querySelector(".info").style.display = "none";
			document.querySelector(".error").innerHTML =
				"Uploading Image failed!!!";
			document.querySelector(".error").style.display = "block";
			document.querySelector("#submit-btn").disabled = false;
			setTimeout(() => {
				document.querySelector(".error").style.display = "none";
				document.querySelector(".error").innerHTML =
					"Something Went Wrong!!!";
			}, 1500);
		});
};

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
}

document.getElementById("image").addEventListener("change", (e) => {
	uploadImage();
});

const getValbyID = (id) => {
	return document.getElementById(id).value;
};

const handleSubmit = async (e) => {
	e.preventDefault();
	document.getElementById("submit-btn").innerText = "Loading...";
	document.querySelector("#submit-btn").disabled = true;
	document.querySelector(".error").style.display = "none";
	const title = getValbyID("name");
	const author = getValbyID("author");
	const date = getValbyID("date");
	if (title && author && date && imageUrl) {
		setDoc(doc(db, "workshops", uuidv4()), {
			title,
			author,
			date,
			imageUrl,
		})
			.then((docRef) => {
				// console.log("Document written with ID: ", docRef.id);
				document.querySelector(".success").style.display = "block";
				setTimeout(() => {
					document.getElementById("submit-btn").innerText = "Submit";
					document.querySelector("#submit-btn").disabled = false;
					window.location.href =
						"https://rohitvpatil0810.github.io/BDS-web-app/activities.html";
				}, 1500);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
				document.querySelector(".error").innerHTML =
					"Something went Wrong!!!";
				document.querySelector(".error").style.display = "block";
				document.getElementById("submit-btn").innerText = "Submit";
				document.querySelector("#submit-btn").disabled = false;
			});
	} else {
		document.querySelector(".error").innerHTML =
			"Please Fill all Details!!!";
		document.querySelector(".error").style.display = "block";
		document.querySelector("#submit-btn").disabled = false;
		document.getElementById("submit-btn").innerText = "Submit";
	}
};

document
	.getElementById("workshopForm")
	.addEventListener("submit", handleSubmit);
