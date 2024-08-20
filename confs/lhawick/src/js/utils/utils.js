export function isDeepEqual(object1, object2) {
    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);
    if (objKeys1.length !== objKeys2.length)
        return false;
    for (var key of objKeys1) {
        const value1 = object1[key];
        const value2 = object2[key];
        const isObjects = isObject(value1) && isObject(value2);
        if ((isObjects && !isDeepEqual(value1, value2)) ||
            (!isObjects && value1 !== value2)) {
            return false;
        }
    }
    return true;
}
;
const isObject = (object) => {
    return object != null && typeof object === "object";
};
const linksLocalStorageKey = "links";
export function saveLinksInLocalStorage(links) {
    const linksAsJson = JSON.stringify(links);
    localStorage.setItem(linksLocalStorageKey, linksAsJson);
}
export function getLinksFromLocalStorage() {
    const linksAsJson = localStorage.getItem(linksLocalStorageKey);
    if (!linksAsJson)
        return [];
    const links = JSON.parse(linksAsJson);
    return links;
}
