import { saveLinksInLocalStorage } from "../../utils/utils.js";
import Link, { ILink } from "../link/link.js";

class LinksManager {
    private static _links : Link[];
    private static _parent: HTMLElement;

    public static get links() : Link[] {
        return this._links;
    }

    public static initLinks(links: Link[]) {
        while (!!LinksManager._parent && !!LinksManager._parent.firstChild)
            LinksManager._parent.removeChild(LinksManager._parent.firstChild);
        LinksManager._links = links;
    }

    public static renderAllInParent(parent: HTMLElement) {
        LinksManager._parent = parent;
        LinksManager._links.forEach(link => link.renderInParent(parent));
    }

    public static getLinkByHtmlElement(htmlElement: HTMLElement) : Link {
        return LinksManager._links.find(link => link.Node === htmlElement);
    }

    public static addNewAndRender(link: Link) {
        LinksManager._links.push(link);
        link.renderInParent(LinksManager._parent);
    }

    public static saveInLocalStorage() {
        const links = LinksManager._links.map<Required<ILink>>(x => {
            return {
                Id: x.Id,
                Title: x.Title,
                IconUrls: x.IconUrls,
                Order: x.Order,
                Target: x.Target
            }
        })

        saveLinksInLocalStorage(links);
    }
}

export default LinksManager;