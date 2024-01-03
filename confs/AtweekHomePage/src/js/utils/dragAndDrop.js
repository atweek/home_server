import LinksManager from "../components/linksManager/linksManager.js";
import { updateLinkAsync } from "../firebase.js";
const links = document.querySelectorAll("link");
const dragEnterClass = "drag-enter";
let draggingElement = null;
export function dragStart(evt) {
    const htmlElement = evt.target;
    htmlElement.style.opacity = '0.3';
    draggingElement = this;
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData("id", draggingElement.id);
}
export function dragOver(evt) {
    evt.preventDefault();
    return false;
}
export function dragEnter(evt) {
    const htmlElement = evt.target;
    htmlElement.classList.add(dragEnterClass);
}
export function dragLeave(evt) {
    const htmlElement = evt.target;
    htmlElement.classList.remove(dragEnterClass);
}
export function dragEnd(evt) {
    const htmlElement = evt.target;
    htmlElement.style.opacity = '1';
    htmlElement.classList.remove(dragEnterClass);
    htmlElement.blur();
}
export async function drop(evt) {
    evt.stopPropagation();
    const htmlElement = evt.target;
    htmlElement.classList.remove(dragEnterClass);
    if (this === draggingElement)
        return false;
    const dropTarget = this;
    const dropLink = LinksManager.getLinkByHtmlElement(dropTarget);
    const draggingLink = LinksManager.getLinkByHtmlElement(draggingElement);
    const dropLinkId = dropLink.Id;
    const dropLinkFirebase = {
        Title: dropLink.Title,
        IconUrl: dropLink.IconUrls.firebaseRef,
        Target: dropLink.Target,
        Order: draggingLink.Order
    };
    const draggingLinkId = draggingLink.Id;
    const draggingLinkFirebase = {
        Title: draggingLink.Title,
        IconUrl: draggingLink.IconUrls.firebaseRef,
        Target: draggingLink.Target,
        Order: dropLink.Order
    };
    const oldDropLinkValue = {
        Id: dropLink.Id,
        Title: dropLink.Title,
        Target: dropLink.Target,
        IconUrls: dropLink.IconUrls
    };
    const newDropLinkValue = {
        Id: draggingLink.Id,
        Title: draggingLink.Title,
        Target: draggingLink.Target,
        IconUrls: draggingLink.IconUrls
    };
    dropLink.update(newDropLinkValue);
    const newDraggingLinkValue = {
        Id: oldDropLinkValue.Id,
        Title: oldDropLinkValue.Title,
        IconUrls: oldDropLinkValue.IconUrls,
        Target: oldDropLinkValue.Target
    };
    draggingLink.update(newDraggingLinkValue);
    await updateLinkAsync(dropLinkId, dropLinkFirebase);
    await updateLinkAsync(draggingLinkId, draggingLinkFirebase);
    LinksManager.saveInLocalStorage();
    return false;
}
