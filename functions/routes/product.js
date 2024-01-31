const express = require("express");
const router = express.Router();
const multer = require("multer");

require("dotenv").config();

const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

const { initializeApp } = require("firebase/app");

const {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

////////////////////////FIREBASE////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyDSC3zGm1CMMHvj6LC1nuzYNNu8S9q1L3k",
  authDomain: "og-paradize.firebaseapp.com",
  projectId: "og-paradize",
  storageBucket: "og-paradize.appspot.com",
  messagingSenderId: "533628128890",
  appId: "1:533628128890:web:a93659dfa3fd9b20bb75c3",
  measurementId: "G-8L8NSB1F1X",
};

let app;
let firestoreDb;
let storage;

const initializeFirebase = () => {
  console.log("You Are Hitting This");

  try {
    app = initializeApp(firebaseConfig);
  } catch (err) {
    throw err;
  }
  storage = getStorage(app);
  firestoreDb = getFirestore(app);
};

const upload = multer({ storage: multer.memoryStorage() });
//const productStorage = getStorage();

//////////////////////////APP ROUTES ////////////////////////////////
router.post(
  "/create/:catagory/:productName",
  upload.single(),
  async (req, res) => {
    console.log("you are hitting this route");
    const catagory = req.params.catagory;
    const productName = req.params.productName;
    //app = initializeApp(firebaseConfig);
    const productStorage = getStorage();
    try {
      const storageRef = ref(
        productStorage,
        `products/${catagory + "/" + req.file.originalname + " "}`
      );
      const metadata = req.file.mimetype.split;

      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      const downloadUrl = await getDownloadURL(snapshot.ref);

      const db = getFirestore();

      await addDoc(collection(db, "products"), {
        name: productName,
        catagory: catagory,
        downloadLink: downloadUrl,
      });

      await addDoc(collection(db, "catagories"), {
        name: catagory,
      });

      res.status(200).json({
        message: "product made successfully",
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadUrl: downloadUrl,
      });
    } catch (e) {
      throw e;
    }
  }
);

router.get("/getall", async (req, res) => {
  console.log("you are hitting the get route");
  //const catagory = req.params.catagory;
  //const productName = req.params.productName;

  const db = getFirestore();

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });

  res.status(200).json({
    name: res.name,
    catagory: res.catagory,
    downloadLink: res.downloadLink,
  });
});

router.delete("/deleteOneCatagory/:catagory", async (req, res) => {
  console.log("you are hitting the delete catagory route");

  db = getFirestore();
  const catagory = req.params.catagory;
  await deleteDoc(doc(db, "catagory", catagory));
});

router.delete("/deleteOneProduct/:product", async (req, res) => {
  console.log("you are hitting the delete product route");
  const productName = req.params.productName;
  await deleteDoc(doc(db, "products", productName));
});

router.put("/update/:product/:quantity", async (req, res) => {
  const db = getFirestore();

  const product = req.params.product;
  const quantity = req.params.quantity;

  const productRef = doc(db, "product", product);

  // Set the "capital" field of the city 'DC'
  await updateDoc(productRef, {
    quantity: quantity,
  });

  res.status(200).json({
    message: "product updated successfully",
  });
});

module.exports = {
  router,
  initializeFirebase,
};
