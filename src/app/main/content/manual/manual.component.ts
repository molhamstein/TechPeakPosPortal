import { MatDialog } from '@angular/material';
import { ConfirmComponent } from './../dialog/confirm/confirm.component';
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

@Component({
    selector: 'fuse-manual',
    templateUrl: './manual.component.html',
    styleUrls: ['./manual.component.scss']
})
export class FusemanualComponent {
    filter = { "email": "", "mobile": "" }
    private onDestroy$ = new Subject<void>();

    constructor(public dialog: MatDialog,
        private mainServ: MainService) {
        // this.navigationModel = new NavigationModel(mainServ);

    }

    loadingIndicator: boolean;
    rows = [];
    dummyData = [];
    refreshTime = 15000
    cash;
    ngOnInit() {
        this.initData();
    }

    initData(withFilter: boolean = false) {
        var filter = { "include": "client", "where": { "status": "pending", "seller_id": + this.mainServ.loginServ.getUserId() } }

        this.mainServ.APIServ.get("pendingClient?filter=" + JSON.stringify(filter)).subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.dummyData = data;
                this.rows = data;
                if (withFilter)
                    this.updateFilter();
                else
                    Observable.interval(this.refreshTime).subscribe(() =>
                        this.getData()
                    )
            }
        })
        // this.mainServ.APIServ.get("paidAccess/getSellerCash?type=manual").subscribe((data: any) => {
        //     if (this.mainServ.APIServ.getErrorCode() == 0) {
        //         if (data['SUM'] != null)
        //             this.cash = data['SUM']
        //         else
        //             this.cash = 0

        //     }
        // })
        this.mainServ.APIServ.get("seller/getMyCash").subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.cash = data['cash']
            }
        })


    }


    updateFilter() {
        const val1 = this.filter['email'].toLowerCase();
        const val2 = this.filter['mobile'];

        // filter our data
        const temp = this.dummyData.filter(function (oneClient) {
            return (oneClient.client.email.toLowerCase().indexOf(val1) !== -1 || !val1) && (oneClient.client.mobile.toLowerCase().indexOf(val2) !== -1 || !val2);
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
    }

    getData() {
        var filter = { "include": "client", "where": { "status": "pending", "seller_id": + this.mainServ.loginServ.getUserId() } }

        this.mainServ.APIServ.get("pendingClient?filter=" + JSON.stringify(filter)).subscribe((data: any) => {
            if (this.mainServ.APIServ.getErrorCode() == 0) {
                this.rows = data;
                this.dummyData = data;
                this.updateFilter();
            }
        })
    }
    activeUser(user) {
        let dialogRef = this.dialog.open(ConfirmComponent, {
            width: '300px',
            panelClass: 'custom-modalbox',
            data: { "message": ". " + "هل تريد تفعيل " + user.client.mobile, isError: false }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.mainServ.APIServ.put("pendingClient/activePenddingClient", { 'client_id': user.client_id, "id": user.id, location_id: parseInt(this.mainServ.loginServ.getLocationId()) }).subscribe((data: any) => {
                    if (this.mainServ.APIServ.getErrorCode() == 0) {
                        this.initData(true);
                    }
                })
            }
        });
    }
}
