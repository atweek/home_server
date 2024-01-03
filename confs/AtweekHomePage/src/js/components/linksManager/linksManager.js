import { saveLinksInLocalStorage } from "../../utils/utils.js";
class LinksManager {
    static get links() {
        return this._links;
    }
    static initLinks(links) {
        while (!!LinksManager._parent && !!LinksManager._parent.firstChild)
            LinksManager._parent.removeChild(LinksManager._parent.firstChild);
        LinksManager._links = links;
    }
    static renderAllInParent(parent) {
        LinksManager._parent = parent;
        LinksManager._links.forEach(link => link.renderInParent(parent));
    }
    static getLinkByHtmlElement(htmlElement) {
        return LinksManager._links.find(link => link.Node === htmlElement);
    }
    static addNewAndRender(link) {
        LinksManager._links.push(link);
        link.renderInParent(LinksManager._parent);
    }
    static saveInLocalStorage() {
        const links = LinksManager._links.map(x => {
            return {
                Id: x.Id,
                Title: x.Title,
                IconUrls: x.IconUrls,
                Order: x.Order,
                Target: x.Target
            };
        });
        saveLinksInLocalStorage(links);
    }
}
export default LinksManager;
