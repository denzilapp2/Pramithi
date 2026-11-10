/* Firebase සැකසුම (Authentication + Firestore පමණක්) – මේවා රහස් නොවේ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJM3GoT8581sTvxxaOhxDQZ_5GGhSyu7M",
  authDomain: "apps-3cfd2.firebaseapp.com",
  projectId: "apps-3cfd2",
  storageBucket: "apps-3cfd2.firebasestorage.app",
  messagingSenderId: "1089519770178",
  appId: "1:1089519770178:web:63c2c72f08c4060515ebdb"
};

/* Google Drive උඩුගත කිරීම – Apps Script "Web app" URL එක මෙතැන දමන්න
   (https://script.google.com/macros/s/.../exec) */
const DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbyTJ8oQ1pOdMO8ZFCAsWCq1f3R4yAKEEvqFeXbMS_cXlpoDFqKJbtG0YPW2WdGa5Xdp/exec";

/* ප්‍රධාන ඇඩ්මින් ගිණුම් (firestore.rules හි ද එකම ලිපිනය තිබිය යුතුයි) */
const SUPER_ADMINS = ["sudanchamalka@gmail.com"];
