import ContextMenu from "../contextMenu/contextMenu.js";
import { longTouchStart, longTouchStop } from "../../utils/touch.js";
import { dragEnd, dragEnter, dragLeave, dragOver, dragStart, drop } from "../../utils/dragAndDrop.js";

export interface IconUrls {
    downloadUrl: string;
    firebaseRef: string;
}

export interface ILink {
    Id?: number;
    Title?: string;
    IconUrls?: IconUrls;
    Target?: string;
    Order?: number;
}

class Link implements ILink {
    private node: HTMLLinkElement = null;

    private titleNode: HTMLElement;
    private iconNode: HTMLImageElement;
    private iconFirebaseRef: string;

    /* #region getters */
    get Id(): number {
        return +this.node.id;
    }
    private set Id(id: number) {
        this.node.id = id.toString();
    }

    get Title(): string {
        return this.titleNode.textContent;
    }
    set Title(title: string) {
        if (!title.trim())
            throw new Error("title is null or empty");

        this.titleNode.textContent = title;
    }

    get IconUrls(): IconUrls {
        return {
            downloadUrl: this.iconNode.src,
            firebaseRef: this.iconFirebaseRef
        }
    }
    set IconUrls(iconUrls: IconUrls) {
        if (!iconUrls.downloadUrl.trim())
            throw new Error("downloadUrl is null or empty");
        if (!iconUrls.firebaseRef.trim())
            throw new Error("firebase ref is null or empty");

        this.iconNode.src = iconUrls.downloadUrl;
        this.iconFirebaseRef = iconUrls.firebaseRef;
    }

    get Target(): string {
        return this.node.href;
    }
    set Target(href: string){
        if (!href.trim()) {
            throw new Error("target href is null or empty");
        }

        this.node.href = href;
    }

    get Order(): number {
        return +this.node.getAttribute("order");
    }
    set Order(order: number) {
        if (order <= 0) {
            throw new Error("order must be has greater than 0")
        }

        this.node.setAttribute("tabindex", (order + 1).toString());
        this.node.setAttribute("order", order.toString());
    }

    get Node(): HTMLLinkElement {
        return this.node;
    }
    /* #endregion */

    constructor(id: number, title: string, iconUrls: IconUrls, target: string, order: number) {
        this.node = document.importNode(this.getPrototype(), true);
        this.titleNode = this.node.querySelector<HTMLElement>('.link__title');
        this.iconNode = this.node.querySelector<HTMLImageElement>('.link__icon');
        
        this.update({Id: id, Title: title, IconUrls: iconUrls, Target: target, Order: order});
        this.addInitEvents();
    }

    public update(newValues: ILink) {
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

    public renderInParent(parent: HTMLElement): Link {
        if (this.node.parentElement !== null) {
            this.node.parentElement.removeChild(this.node);
        }

        if (!!parent)
            parent.appendChild(this.node);

        return this;
    }

    public remove() {
        if (!!this.node?.parentElement)
            this.node.parentElement.removeChild(this.node);
    }

    public equals(other: ILink): boolean {
        if (!other) return false;
        if (this === other) return true;

        return this.IconUrls.downloadUrl === other.IconUrls.downloadUrl
            && this.IconUrls.firebaseRef === other.IconUrls.firebaseRef 
            && this.Order === other.Order
            && this.Target === other.Target
            && this.Title === other.Title;
    }

    /* #region private methods */
    private getPrototype(): HTMLLinkElement {
        const template: HTMLTemplateElement = document.querySelector("#link-template");
        const prototype: HTMLLinkElement = template.content.querySelector<HTMLLinkElement>("a");

        return prototype;
    }

    private addInitEvents(): void {
        this.addContextMenuEvents();
        this.addDragAndDropEvent();
    }

    private addContextMenuEvents(): void {
        const TOUCH_START_DELAY = 800;

        this.node.addEventListener("contextmenu", ContextMenu.showContextMenu);
        this.node.addEventListener("touchstart", evt => longTouchStart(evt, () => ContextMenu.showContextMenu(evt), TOUCH_START_DELAY));
        this.node.addEventListener("touchend", longTouchStop);
    }

    private addDragAndDropEvent() {
        this.node.ondragstart = dragStart;
        this.node.ondragover = dragOver;
        this.node.ondragenter = dragEnter;
        this.node.ondragleave = dragLeave;
        this.node.ondragend = dragEnd;
        this.node.ondrop = drop;
    }
    /* #endregion */
}

export default Link;