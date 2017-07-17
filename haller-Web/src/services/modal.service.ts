// import * as _ from "lodash";

export class ModalService {
  private modals: any[] = [];

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    let modalToRemove = null;//_.find(this.modals, { id: id });
    this.modals.forEach(modal => {
      if (modal.id == id) {
        modalToRemove = modal;
      }
    });
    let index = this.modals.indexOf(modalToRemove);
    this.modals.splice(index, 1);
    // this.modals = _.without(this.modals, modalToRemove);
  }

  open(id: string) {
    // open modal specified by id
    let modal = null;//_.find(this.modals, { id: id });
    this.modals.forEach(modalEle => {
      if (modalEle.id == id) {
        modal = modalEle;
      }
    });
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    let modal = null;//_.find(this.modals, { id: id });
    this.modals.forEach(modalEle => {
      if (modalEle.id == id) {
        modal = modalEle;
      }
    });
    modal.close();
  }
}
