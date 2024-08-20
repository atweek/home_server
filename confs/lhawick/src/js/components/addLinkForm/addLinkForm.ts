import { addNewLinkAsync } from "../../firebase.js";
import EditLinkForm from "../editLinkForm/editLinkForm.js";
import Link from "../link/link.js";
import LinksManager from "../linksManager/linksManager.js";

const dialog = document.querySelector<HTMLDialogElement>("#add-link-dialog");
const form = dialog.querySelector<HTMLFormElement>("#add-link-form");

const linkTitleInput = form.querySelector<HTMLInputElement>("#addLinkTitle");
const linkTargetInput = form.querySelector<HTMLInputElement>("#addLinkHref");
const linkIconInput = form.querySelector<HTMLInputElement>("#addLinkIcon");
const linkIconPreview = form.querySelector<HTMLImageElement>("#addLinkIcon__preview");
const closeDialogBtn = dialog.querySelector("#add-link__close-btn");
const addNewLinkBtn = document.querySelector("#add-new-link-btn");

class AddLinkForm {
    public static show() {
        EditLinkForm.close();

        linkTitleInput.value = "";
        linkTargetInput.value = "";
        linkIconInput.value = "";
        linkIconPreview.src = "";

        dialog.show();
    }

    public static close() {
        dialog.close();
    }

    public static async onFormSubmitAsync(evt: Event): Promise<void> {
        evt.preventDefault();
        AddLinkForm.close();

        const newLink = await addNewLinkAsync({
            Title: linkTitleInput.value,
            Target: linkTargetInput.value
        }, linkIconInput.files[0])

        LinksManager.addNewAndRender(new Link(newLink.Id, newLink.Title, newLink.IconUrls, newLink.Target, newLink.Order));
    }

    public static onImageChanged() {
        const file = linkIconInput.files[0];
        const reader = new FileReader();
    
        reader.addEventListener("load", function () {
            linkIconPreview.src = reader.result.toString();
        }, false);
    
        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

addNewLinkBtn.addEventListener("click", AddLinkForm.show)
closeDialogBtn.addEventListener("click", AddLinkForm.close);
form.addEventListener("submit", async evt => await AddLinkForm.onFormSubmitAsync(evt));
linkIconInput.addEventListener("change", AddLinkForm.onImageChanged);

export default AddLinkForm;