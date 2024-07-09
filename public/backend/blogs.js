import { app } from "./config/config.js";
import { setDoc, getDoc, deleteDoc, updateDoc, getDocs, doc, getFirestore, collection } from "firebase/firestore"

const db = getFirestore(app)
const collectionName = "blogs"

function createBlog(title, about, blog){
    try {
        const blogRef = doc(db, collectionName);
        setDoc(blogRef, {
            title,
            about,
            blog,
        })
    } catch (error) {
        console.log(error)
    }
}

function deleteBlog(id){
    try {
        const blogRef = doc(db, collectionName, id);
        deleteDoc(blogRef);
    } catch (error) {
        console.log(error)
    }
}

function editBlog(id, title, about, blog){
    try {
        const blogRef = doc(db, collectionName, id);
        updateDoc(blogRef, {
            title,
            about,
            blog,
        });
    } catch (error) {
        console.log(error)
    }
}

async function getAllBlogs() {
    try {
      const blogCollectionRef = collection(db, collectionName);
      const snapshot = await getDocs(blogCollectionRef);
      const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return blogs;
    } catch (error) {
      console.log(error);
    }
  }
  
  async function getBlogById(id) {
    try {
      const blogRef = doc(db, collectionName, id);
      const docSnap = await getDoc(blogRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function getBlogByUserId(userId) {
    try {
      const blogCollectionRef = collection(db, "users");
      const q = query(blogCollectionRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return blogs;
    } catch (error) {
      console.log(error);
    }
  }

export {
    createBlog,
    deleteBlog,
    editBlog,
    getAllBlogs,
    getBlogById, 
    getBlogByUserId
}