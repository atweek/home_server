import ContextMenu from "../contextMenu/contextMenu.js";
import { longTouchStart, longTouchStop } from "../../utils/touch.js";
import { dragEnd, dragEnter, dragLeave, dragOver, dragStart, drop } from "../../utils/dragAndDrop.js";
class Link {
    get Id() {
        return +this.node.id;
    }
    set Id(id) {
        this.node.id = id.toString();
    }
    get Title() {
        return this.titleNode.textContent;
    }
    set Title(title) {
        if (!title.trim())
            throw new Error("title is null or empty");
        this.titleNode.textContent = title;
    }
    get IconUrls() {
        return {
            downloadUrl: this.iconNode.src,
            firebaseRef: this.iconFirebaseRef
        };
    }
    set IconUrls(iconUrls) {
        if (!iconUrls.downloadUrl.trim())
            throw new Error("downloadUrl is null or empty");
        if (!iconUrls.firebaseRef.trim())
            throw new Error("firebase ref is null or empty");
        this.iconNode.src = iconUrls.downloadUrl;
        this.iconFirebaseRef = iconUrls.firebaseRef;
    }
    get Target() {
        return this.node.href;
    }
    set Target(href) {
        if (!href.trim()) {
            throw new Error("target href is null or empty");
        }
        this.node.href = href;
    }
    get Order() {
        return +this.node.getAttribute("order");
    }
    set Order(order) {
        if (order <= 0) {
            throw new Error("order must be has greater than 0");
        }
        this.node.setAttribute("tabindex", (order + 1).toString());
        this.node.setAttribute("order", order.toString());
    }
    get Node() {
        return this.node;
    }
    constructor(id, title, iconUrls, target, order) {
        this.node = null;
        this.node = document.importNode(this.getPrototype(), true);
        this.titleNode = this.node.querySelector('.link__title');
        this.iconNode = this.node.querySelector('.link__icon');
        this.update({ Id: id, Title: title, IconUrls: iconUrls, Target: target, Order: order });
        this.addInitEvents();
    }
    update(newValues) {
        if (!!newValues.Id)
            this.Id = newValues.Id;
        if (!!newValues.Title)
            this.Title = newValues.Title;
        if (!!newValues.IconUrls)
            this.IconUrls = newValues.IconUrls;
        if (!!newValues.Target)
            this.Target = newValues.Target;
        if (!!newValues.Order) {
            this.Order = newValues.Order;
        }
    }
    renderInParent(parent) {
        if (this.node.parentElement !== null) {
            this.node.parentElement.removeChild(this.node);
        }
        if (!!parent)
            parent.appendChild(this.node);
        return this;
    }
    remove() {
        var _a;
        if (!!((_a = this.node) === null || _a === void 0 ? void 0 : _a.parentElement))
            this.node.parentElement.removeChild(this.node);
    }
    equals(other) {
        if (!other)
            return false;
        if (this === other)
            return true;
        return this.IconUrls.downloadUrl === other.IconUrls.downloadUrl
            && this.IconUrls.firebaseRef === other.IconUrls.firebaseRef
            && this.Order === other.Order
            && this.Target === other.Target
            && this.Title === other.Title;
    }
    getPrototype() {
        const template = document.querySelector("#link-template");
        const prototype = template.content.querySelector("a");
        return prototype;
    }
    addInitEvents() {
        this.addContextMenuEvents();
        this.addDragAndDropEvent();
    }
    addContextMenuEvents() {
        const TOUCH_START_DELAY = 800;
        this.node.addEventListener("contextmenu", ContextMenu.showContextMenu);
        this.node.addEventListener("touchstart", evt => longTouchStart(evt, () => ContextMenu.showContextMenu(evt), TOUCH_START_DELAY));
        this.node.addEventListener("touchend", longTouchStop);
    }
    addDragAndDropEvent() {
        this.node.ondragstart = dragStart;
        this.node.ondragover = dragOver;
        this.node.ondragenter = dragEnter;
        this.node.ondragleave = dragLeave;
        this.node.ondragend = dragEnd;
        this.node.ondrop = drop;
    }
}
export default Link;
