import { addNewLinkAsync } from "../../firebase.js";
import EditLinkForm from "../editLinkForm/editLinkForm.js";
import Link from "../link/link.js";
import LinksManager from "../linksManager/linksManager.js";
const dialog = document.querySelector("#add-link-dialog");
const form = dialog.querySelector("#add-link-form");
const linkTitleInput = form.querySelector("#addLinkTitle");
const linkTargetInput = form.querySelector("#addLinkHref");
const linkIconInput = form.querySelector("#addLinkIcon");
const linkIconPreview = form.querySelector("#addLinkIcon__preview");
const closeDialogBtn = dialog.querySelector("#add-link__close-btn");
const addNewLinkBtn = document.querySelector("#add-new-link-btn");
class AddLinkForm {
    static show() {
        EditLinkForm.close();
        linkTitleInput.value = "";
        linkTargetInput.value = "";
        linkIconInput.value = "";
        linkIconPreview.src = "";
        dialog.show();
    }
    static close() {
        dialog.close();
    }
    static async onFormSubmitAsync(evt) {
        evt.preventDefault();
        AddLinkForm.close();
        const newLink = await addNewLinkAsync({
            Title: linkTitleInput.value,
            Target: linkTargetInput.value
        }, linkIconInput.files[0]);
        LinksManager.addNewAndRender(new Link(newLink.Id, newLink.Title, newLink.IconUrls, newLink.Target, newLink.Order));
    }
    static onImageChanged() {
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
addNewLinkBtn.addEventListener("click", AddLinkForm.show);
closeDialogBtn.addEventListener("click", AddLinkForm.close);
form.addEventListener("submit", async (evt) => await AddLinkForm.onFormSubmitAsync(evt));
linkIconInput.addEventListener("change", AddLinkForm.onImageChanged);
export default AddLinkForm;
