import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDw3p8l15gAOMPgkgmlU3RkHZwu8ohOM3w",
    authDomain: "gen-ai-9186.firebaseapp.com",
    projectId: "gen-ai-9186",
    storageBucket: "gen-ai-9186.firebasestorage.app",
    messagingSenderId: "133275512940",
    appId: "1:133275512940:web:e4c3dcfda8a65948752849"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveReservation = async function (data) {
    await addDoc(collection(db, "reservations"), data);
};

window.getReservations = async function () {
    const querySnapshot = await getDocs(collection(db, "reservations"));
    const reservations = [];
    querySnapshot.forEach((doc) => {
        reservations.push({ id: doc.id, ...doc.data() });
    });
    return reservations;
};

window.updateReservation = async function (id, updates) {
    const reservationRef = doc(db, "reservations", id);
    await updateDoc(reservationRef, updates);
};

window.deleteReservation = async function (id) {
    const reservationRef = doc(db, "reservations", id);
    await deleteDoc(reservationRef);
};