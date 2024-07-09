import { app } from "./config/config.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth"
import { setDoc, doc, getFirestore} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app)

async function signUp(email, password, name){
    try{
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
        .then(userCredintials => userCredintials.user)
        newUser.displayName = name;
        updateProfile(newUser, { displayName: name })
        return await signIn(email, password);

    } catch (error) {
        console.log(error)
    }
}


async function signIn(email, password){
    try{
        const user = await signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => userCredential.user)
        auth.currentUser = user;
        return await getCurrentUser();
    } catch (error) {
        console.log(error)
    }
}

async function logOut(){
    try {
        await signOut(auth);
        auth.currentUser = null;
        return true;
        
    } catch (error) {
        console.log(error)
        return false;
    }
}

async function getCurrentUser(){
    try{
        return auth.currentUser;
    } catch (error) {
        console.log(error)
    }
}

export {
    signUp,
    signIn,
    logOut,
    getCurrentUser,
}