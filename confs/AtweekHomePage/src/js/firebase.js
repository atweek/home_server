import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref as firebaseRef, get, child, update, set, remove } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyBglOSoBXVS3fxX61giCYePguGW9VzXO2I",
    authDomain: "atweek-home-page.firebaseapp.com",
    projectId: "atweek-home-page",
    storageBucket: "atweek-home-page.appspot.com",
    messagingSenderId: "442861645408",
    appId: "1:442861645408:web:85982c835fabfcf4239d05",
    databaseURL: "https://atweek-home-page-default-rtdb.europe-west1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const getRealtimeDbRef = () => firebaseRef(getDatabase(app));
export async function getValueFromRealtimeDbAsync(path) {
    const dbRef = getRealtimeDbRef();
    try {
        const snapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        console.warn(`Data doesn't exist on db path ${path}`);
    }
    catch (error) {
        console.error(error);
    }
    return null;
}
export async function getLinkIconUrlFromStorageAsync(url) {
    const storage = getStorage();
    const linkIconRef = storageRef(storage, url);
    try {
        return await getDownloadURL(linkIconRef);
    }
    catch (error) {
        console.error(error);
    }
    return null;
}
export async function uploadIconAsync(fileName, newIcon) {
    const storage = getStorage();
    const newIconRef = storageRef(storage, `linkIcons/${fileName}`);
    const snapshot = await uploadBytes(newIconRef, newIcon);
    return snapshot.ref.toString();
}
export async function deleteIconAsync(ref) {
    if (!ref.trim()) {
        throw new Error("ref is empty or null");
    }
    const storage = getStorage();
    const deletingIconRef = storageRef(storage, ref);
    await deleteObject(deletingIconRef);
}
export async function updateLinkAsync(linkId, link) {
    const realtimeDb = getRealtimeDbRef();
    const updates = {};
    updates[`links/${linkId}`] = link;
    return await update(realtimeDb, updates);
}
export async function addNewLinkAsync(newLink, icon) {
    const realtimeDb = getDatabase();
    const links = await getValueFromRealtimeDbAsync("links");
    const linksCount = Object.keys(links).length;
    const newLinkId = linksCount + 1;
    const newLinkOrder = linksCount + 1;
    const newFileName = `link-${newLinkId}_${icon.name}`;
    const newFileRef = await uploadIconAsync(newFileName, icon);
    const addingLink = {
        Title: newLink.Title,
        Target: newLink.Target,
        Order: newLinkOrder,
        IconUrl: newFileRef
    };
    await set(firebaseRef(realtimeDb, 'links/' + newLinkId), addingLink);
    return {
        Id: newLinkId,
        Title: addingLink.Title,
        Target: addingLink.Target,
        Order: newLinkOrder,
        IconUrls: {
            firebaseRef: addingLink.IconUrl,
            downloadUrl: await getLinkIconUrlFromStorageAsync(addingLink.IconUrl)
        }
    };
}
export async function deleteLinkAsync(linkId) {
    const realtimeDb = getDatabase();
    await remove(firebaseRef(realtimeDb, "links/" + linkId));
}
