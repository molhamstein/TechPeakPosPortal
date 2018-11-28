import { ConfirmComponent } from './../dialog/confirm/confirm.component';
import { ActiveCodeComponent } from './../dialog/active-code/active-code.component';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from './../../../core/services/main.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timeInterval } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { NavigationModel } from '../../../navigation.model';
import { FuseNavigationService } from '../../../core/components/navigation/navigation.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Socket } from 'ng-socket-io';

import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'fuse-automatic',
    templateUrl: './automatic.component.html',
    styleUrls: ['./automatic.component.scss']
})
export class FuseautomaticComponent {
    loadingIndicator = true;
    categories;
    colorsCatrgories = [];
    hoverArray = [];
    cash;
    code;
    constructor(
        private mainServ: MainService, public dialog: MatDialog) {
        this.loadingIndicator = false;
        this.init();

    }

    init() {
        this.mainServ.APIServ.get("seller/getCategories").subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.loadingIndicator = true;
                this.categories = data;
                this.fillColorArrray()
            }
        })
        this.mainServ.APIServ.get("billing/getSellerCash?type=automatic").subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.cash = data['SUM']
            }
        })
    }
    fillColorArrray() {
        for (var index = 0; index < this.categories.length; index++) {
            var element = this.categories[index];
            this.hoverArray[index] = false;
            var color = this.mainServ.globalServ.getColor(index)
            this.colorsCatrgories[index] = { "mainColor": color + "99", "secondeColor": color };

        }
    }

    getCode(category, index) {
        var filter = { "price": category.price, "used_count": category.used_count }
        this.loadingIndicator = false;

        this.mainServ.APIServ.get('locationCode/getCodeSeller?filter=' + JSON.stringify(filter)).subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.loadingIndicator = true;
                this.openCodeDialog({ code: data, color: this.colorsCatrgories[index] })
            }
        })



    }


    openCodeDialog(data) {
        let dialogRef = this.dialog.open(ActiveCodeComponent, {
            width: '500px',
            panelClass: 'custom-modalbox',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.init();
            }
        });
    }

    errorDialog(message) {
        let dialogRef = this.dialog.open(ConfirmComponent, {
            width: '300px',
            panelClass: 'custom-modalbox',
            data: { "message": message, isError: true }
        });

        dialogRef.afterClosed().subscribe(result => {

        });

    }

    searchOfCode() {
        if (this.code != null && this.code != "") {
            var filter = { "where": { "code": this.code, "seller_id": + this.mainServ.loginServ.getUserId() } }
            this.mainServ.APIServ.get("locationCode?filter=" + JSON.stringify(filter)).subscribe((data: any) => {
                if (this.mainServ.APIServ.getErrorCode() == 0) {
                    if (data[0] != null)
                        this.openCodeDialog({ code: data[0], color: { "mainColor": "#3c425299", "secondeColor": "#3c4252" } })
                    else {
                        this.errorDialog("ليس لديك هذه الشيفرة " + this.code)
                    }
                }
            })
        }
    }


}
