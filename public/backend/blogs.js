import { getUserName } from "./auth.js";
import { app } from "./config/config.js";
import { setDoc, getDoc, deleteDoc, updateDoc, getDocs, doc, getFirestore, collection, query, where, addDoc } from "firebase/firestore"

const db = getFirestore(app)
const collectionName = "blogs"

async function createBlog(title, about, blog, owner){
    try {
        const ownerName = await getUserName(owner)
        const blogObject = await addDoc(collection(db, collectionName), { title, about, blog, owner, ownerName});

        return blogObject;
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
      const blogCollectionRef = collection(db, collectionName);
      const q = query(blogCollectionRef, where("owner", "==", userId));
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