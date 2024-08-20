import { deleteLinkAsync } from "../../firebase.js";
import EditLinkForm from "../editLinkForm/editLinkForm.js";
import LinksManager from "../linksManager/linksManager.js";
const contextMenu = document.getElementById("context-menu");
const editLinkButton = contextMenu.querySelector("#context-menu__edit");
const deleteLinkButton = contextMenu.querySelector("#context-menu__delete");
class ContextMenu {
    static get lastCurrentTarget() {
        return ContextMenu._lastCurrentTarget;
    }
    static showContextMenu(evt) {
        ContextMenu._lastCurrentTarget = evt.currentTarget;
        let x, y;
        if (evt instanceof TouchEvent) {
            const touchEvent = evt;
            const touch = touchEvent.targetTouches.item(0);
            x = touch.clientX;
            y = touch.clientY;
        }
        else if (evt instanceof MouseEvent) {
            evt.preventDefault();
            const mouseEvent = evt;
            x = mouseEvent.clientX;
            y = mouseEvent.clientY;
        }
        else
            throw new Error("Unknow event: " + typeof evt);
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = 'flex';
    }
    static removeContextMenu(evt) {
        const target = evt.target;
        if (target === null) {
            return;
        }
        if (!target.classList.contains("link")) {
            contextMenu.style.display = "none";
        }
    }
}
export default ContextMenu;
document.addEventListener("click", ContextMenu.removeContextMenu);
document.addEventListener("contextmenu", ContextMenu.removeContextMenu, true);
editLinkButton.addEventListener("click", evt => {
    const targetLink = LinksManager.getLinkByHtmlElement(ContextMenu.lastCurrentTarget);
    EditLinkForm.show(targetLink);
});
deleteLinkButton.addEventListener("click", async (evt) => {
    const targetLink = LinksManager.getLinkByHtmlElement(ContextMenu.lastCurrentTarget);
    targetLink.remove();
    await deleteLinkAsync(targetLink.Id);
});
