import { LightningElement, api, wire } from 'lwc';
import fetchLookupData from '@salesforce/apex/CustomLookkupController.fetchLookupData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DELAY = 300;

export default class MultiCustomLookUp extends LightningElement {

    @api objectApiName = 'Account';
    @api label = "Account";
    @api placeholder = "Search Account";
    @api iconName = "standard:account";
    searchKey;
    hasRecord = false;
    searchOutput = [];
    delayTimeout;
    selectedRecords = [];



    @wire(fetchLookupData, {
        searchKey: "$searchKey",
        objectApiName: "$objectApiName"
    }) searchResult({ data, error }) {
        if (data) {
            console.log('Data', data);
            this.hasRecord = data.length > 0 ? true : false;
            this.searchOutput = data;
        } else if (error) {
            console.log("Error", error);
        }
    };

    changeHandler(event) {
        clearTimeout(this.delayTimeout);
        let value = event.target.value;
        setTimeout(() => {
            this.searchKey = value;
        }, DELAY);

    }

    clickHandler(event) {
        let recId = event.target.getAttribute("data-recid");
        console.log("Record Id", recId);
        if (this.validateDuplicate(recId)) {
            let selectedRecord = this.searchOutput.find((currentItem) => currentItem.Id === recId);
            let pill = {
                type: 'icon',
                label: selectedRecord.Name,
                name: recId,
                iconName: this.iconName,
                alternativeText: selectedRecord.Name,
            };
            this.selectedRecords = [...this.selectedRecords, pill];
        }

    }

    get showPillContainer() {
        return this.selectedRecords.length > 0 ? true : false;
    }

    handleItemRemove(event) {
        const index = event.detail.index;
        this.selectedRecords.splice(index, 1);
    }

    validateDuplicate(selectedRecord) {
        let isValid = true;
        let isRecordAlreadySelected = this.selectedRecords.find(currentItem => currentItem.name === selectedRecord);
        if (isRecordAlreadySelected) {
            isValid = false;
            this.dispatchEvent(new ShowToastEvent({
                title: "Error!",
                message: "Pill is Already Selected",
                variant: "error"
            }));
        } else {
            isValid = true;
        }
        return isValid;
    }

}