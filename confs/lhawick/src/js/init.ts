import { getValueFromRealtimeDbAsync, getLinkIconUrlFromStorageAsync } from "./firebase.js";
import Link, { ILink, IconUrls } from './components/link/link.js';
import LinksManager from "./components/linksManager/linksManager.js";
import { getLinksFromLocalStorage, saveLinksInLocalStorage } from "./utils/utils.js";

const linksContainer = document.querySelector(".links__container") as HTMLElement;
if (!linksContainer)
    throw new Error("Failed to find links container with class .links__container");

const linksFromLocalStorage = getLinksFromLocalStorage()
    .map(x => new Link(x.Id, x.Title, x.IconUrls, x.Target, x.Order));

LinksManager.initLinks(linksFromLocalStorage);
LinksManager.renderAllInParent(linksContainer);

const links = await getLinksAsync();

LinksManager.initLinks(links);
LinksManager.renderAllInParent(linksContainer);

async function getLinksAsync(): Promise<Link[]> {
    const linksObject = await getValueFromRealtimeDbAsync("links");
    const gotLinks = await Promise.all(
        Object
        .keys(linksObject)
        .map<Promise<Required<ILink>>>(async index => {
            const id: number = +index;
            const title: string = linksObject[index].Title;
            const iconUrls: IconUrls = {
                firebaseRef: linksObject[index].IconUrl,
                downloadUrl: await getLinkIconUrlFromStorageAsync(linksObject[index].IconUrl)
            };
            const target: string = linksObject[index].Target;
            const order: number = +linksObject[index].Order;

            return {
                Id: id,
                Title: title,
                IconUrls: iconUrls,
                Target: target,
                Order: order
            }
        }));
    
    saveLinksInLocalStorage(gotLinks);

    const links = gotLinks.map(x => new Link(x.Id, x.Title, x.IconUrls, x.Target, x.Order))
    console.log("🚀 ~ file: init.ts:48 ~ getLinksAsync ~ links:", links)

    const sortedLinks = links.sort((prev, next) => +prev.Order - +next.Order);
    console.log("🚀 ~ file: init.ts:51 ~ getLinksAsync ~ sortedLinks:", sortedLinks)
    return sortedLinks;
}