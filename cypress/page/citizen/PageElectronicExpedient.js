
import { SectionCover } from "./electronic-expedient/SectionCover";
import { SectionDocumentFinder } from "./electronic-expedient/SectionDocumentFinder";
import { SectionDocument } from "./electronic-expedient/SectionDocuments";
export class PageElectronicExpedient{

    constructor(){
        this.sectionCover = new SectionCover();
        this.sectionDocumentFinder = new SectionDocumentFinder();
        this.sectionDocument = new SectionDocument();
    }

    title = () => cy.get('div.container-header-expedient-documents-details h3');


}


