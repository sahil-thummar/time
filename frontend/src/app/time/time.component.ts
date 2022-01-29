import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Component({
    selector: 'app-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

    timeList = [];
    InHours: any = "0:0";
    OutHours: any = "0:0";
    FirstIn: any = "0:0";
    LastOut: any = "0:0";
    constructor(public http: HttpClient) {
    }

    ngOnInit() {
        this.getTimeList();
    }

    getTimeList() {
        this.http.get(`http://localhost:4000/api/time/getTime`).pipe(map((res) => Object(res))).subscribe((resData) => {
            if (resData.data && resData.data.timeList) {
                this.timeList = resData.data.timeList;
                let InHours = 0;
                let OutHours = 0;
                this.timeList.map((time, index) => {
                    time.inS = `${Math.floor(time.in / 60)}:${time.in % 60}`;
                    time.outS = `${Math.floor(time.out / 60)}:${time.out % 60}`;
                    let diff = time.out - time.in;
                    time.diffS = `${Math.floor(diff / 60)}:${diff % 60}`;
                    InHours += Number(diff);
                    this.OutHours += time.diff;
                    if (index == 0) {
                        OutHours = OutHours - time.in;
                        this.FirstIn = time.inS;
                    }
                    if ((index + 1) == this.timeList.length) {
                        this.LastOut = time.outS;
                        OutHours = OutHours + time.out - InHours;
                        this.InHours = `${Math.floor(InHours / 60)}:${InHours % 60}`;
                        this.OutHours = `${Math.floor(OutHours / 60)}:${OutHours % 60}`;
                    }
                });
            }
        });
    }
    deleteTime(timeId) {
        if (confirm("Are you sure you want to delete?")) {
            this.http.delete(`http://localhost:4000/api/time/deleteTime?timeId=${timeId}`).subscribe(() => {
                this.getTimeList();
            })
        }
    }
}