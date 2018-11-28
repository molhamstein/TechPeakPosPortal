import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MainService } from './../../../../core/services/main.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'error',
    templateUrl: 'error.component.html',
    styleUrls: ['error.component.scss']
})
export class ErrorComponent {
    paymentForm: FormGroup;
    consultant = [];

    loadingIndicator = true

    code = {};
    color = [];
    constructor(
        public dialogRef: MatDialogRef<ErrorComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private mainServ: MainService,

    ) {

        this.code = data['code']
        this.color = data['color']

    }
    ngOnInit() {
    }

    sold() {
        this.loadingIndicator = false;

        this.mainServ.APIServ.put('locationCode/soldCode', { "id": this.code['id'] }).subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.loadingIndicator = true;

                this.dialogRef.close(true)
            }
        })

    }
    close() {
        this.dialogRef.close()
    }


}
