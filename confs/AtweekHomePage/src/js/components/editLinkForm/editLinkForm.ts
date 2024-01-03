import { LinkInFirebase, deleteIconAsync, getLinkIconUrlFromStorageAsync, updateLinkAsync, uploadIconAsync } from "../../firebase.js";
import AddLinkForm from "../addLinkForm/addLinkForm.js";
import Link, { ILink } from "../link/link.js";

const dialog = document.querySelector<HTMLDialogElement>("#edit-link-dialog");
const form = dialog.querySelector<HTMLFormElement>("#edit-link-form");

const linkTitleInput = form.querySelector<HTMLInputElement>("#linkTitle");
const linkTargetInput = form.querySelector<HTMLInputElement>("#linkHref");
const linkIconInput = form.querySelector<HTMLInputElement>("#linkIcon");
const linkIconPreview = form.querySelector<HTMLImageElement>("#linkIcon__preview");
const closeDialogBtn = dialog.querySelector("#edit-link__close-btn");

class EditLinkForm {

    private static editingLink: Link | null;
    private static isNewImageLoaded: boolean = false;

    public static show(linkToEdit: Link): void {
        AddLinkForm.close();

        if (!linkToEdit) {
            console.error("cant show edit link form because link is null");
            return;
        }

        // Сохраняем для дальнейших манипуляций пока диалог открыт
        EditLinkForm.editingLink = linkToEdit;

        linkTitleInput.value = linkToEdit.Title;
        linkTargetInput.value = linkToEdit.Target;
        linkIconPreview.src = linkToEdit.IconUrls.downloadUrl;

        EditLinkForm.isNewImageLoaded = false;

        dialog.show();
    }

    public static close() {
        dialog.close();
    }

    public static async onFormSubmitAsync(evt: Event): Promise<void> {
        evt.preventDefault();

        if (!linkTitleInput.value.trim())
            return;
        if (!linkTargetInput.value.trim())
            return;

        const editedLink : ILink = {
            Id: EditLinkForm.editingLink.Id,
            Title: linkTitleInput.value,
            Target: linkTargetInput.value,
            IconUrls: EditLinkForm.editingLink.IconUrls,
            Order: EditLinkForm.editingLink.Order
        }

        if (editedLink.Title === EditLinkForm.editingLink.Title 
            && editedLink.Target === EditLinkForm.editingLink.Target
            && !EditLinkForm.isNewImageLoaded) {
                return;
            }

        EditLinkForm.close();

        if (EditLinkForm.isNewImageLoaded) {
            await deleteIconAsync(EditLinkForm.editingLink.IconUrls.firebaseRef);
            
            const newIconRef = await EditLinkForm.uploadNewIconAsync();
            editedLink.IconUrls.firebaseRef = newIconRef;
            editedLink.IconUrls.downloadUrl = await getLinkIconUrlFromStorageAsync(newIconRef);
        }

        EditLinkForm.editingLink.update(editedLink);
        EditLinkForm.editingLink = null;

        const linkModel: LinkInFirebase = {
            IconUrl: editedLink.IconUrls.firebaseRef,
            Title: editedLink.Title,
            Target: editedLink.Target,
            Order: editedLink.Order
        };

        await updateLinkAsync(editedLink.Id, linkModel);
    }

    private static async uploadNewIconAsync(): Promise<string> {
        const file = linkIconInput.files[0];
        if (!file)
            return;

        const newFileName = `link-${EditLinkForm.editingLink.Id}_${file.name}`;
        const newFileRef = await uploadIconAsync(newFileName, file);

        return newFileRef;
    }

    public static onImageChanged() {
        const file = linkIconInput.files[0];
        const reader = new FileReader();
    
        reader.addEventListener("load", function () {
            linkIconPreview.src = reader.result.toString();
            EditLinkForm.isNewImageLoaded = true;
        }, false);
    
        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

linkIconInput.addEventListener("change", EditLinkForm.onImageChanged);
form.addEventListener("submit", async evt => await EditLinkForm.onFormSubmitAsync(evt));
closeDialogBtn.addEventListener("click", EditLinkForm.close);

export default EditLinkForm;