import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from '../../services/modal.service';

declare var $: any;

@Component({
    selector: 'modal',
    template: '<ng-content></ng-content>',
})
export class ModalComponent implements OnInit {

    @Input() id: string;
    private element: any;

    constructor(private el: ElementRef, private modalService: ModalService) {
        this.element = $(el.nativeElement);
    }

    ngOnInit() {
        let modal = this;

        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }
        // console.info('this.id', this.id);

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        this.element.appendTo('body');

        // close modal on background click
        // this.element.on('click', function (e: any) {
        //     var target = $(e.target);
        //     console.log("('.modal-body').length", target.closest('.modal-body').length);
        //     console.log("!('.modal-body').length", !target.closest('.modal-body').length);
        //     if (!target.closest('.modal-body').length) {
        //         modal.close();
        //     }
        // });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.show();
        $('body').addClass('modal-open');
    }

    // close modal
    close(): void {
        this.element.hide();
        $('body').removeClass('modal-open');
    }

}
