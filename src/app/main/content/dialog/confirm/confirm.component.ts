import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MainService } from './../../../../core/services/main.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'confirm',
    templateUrl: 'confirm.component.html',
    styleUrls: ['confirm.component.scss']
})
export class ConfirmComponent {

    message = "";
    isError=false;
    constructor(
        public dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private mainServ: MainService,

    ) {

        this.message = data['message']
        this.isError = data['isError']

    }
    ngOnInit() {
    }

    close(isYes) {
        this.dialogRef.close(isYes)
    }


}
