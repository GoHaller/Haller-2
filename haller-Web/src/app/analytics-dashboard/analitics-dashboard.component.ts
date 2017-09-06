import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { PostService } from '../../services/post.services';
import { ModalService } from '../../services/modal.service';
import { Ng2PaginationModule } from 'ng2-pagination';
import { EventJoinComponent } from "../modal/eventJoin.component";
import * as Chartist from 'chartist';
declare var $: any;
@Component({
    selector: 'app-analitics-dashboard',
    templateUrl: './analitics-dashboard.component.html',
    styleUrls: ['./analitics-dashboard.component.css']
})
export class AnaliticsDashboardComponent implements OnInit {

    public baseUrl: string = 'none';
    public countData: any;
    public showCaseData: any = {};
    public showDiv: boolean = false;
    public showNameList: boolean = false;
    public users: any = [];
    public eventType: string = 'none';
    public staffEventTable: any;
    public staffCount: any = [];
    public staffJoinerCount: any = [];
    public eventSevandaysEvent = '';
    public sevandaysfeed = '';
    public checking = '';
    public sevanDaysEvent = '';
    public thirthydDaysEvent = '';
    public thirthyDaysfeed = '';
    public year: string = '';


    public id;


    constructor(private postService: PostService, private modalService: ModalService, private zone: NgZone, private cdrf: ChangeDetectorRef) {
    }


    showEventUserName(days) {
        this.postService.getDashBoardEventJoinners(days).subscribe((res: any) => {
            this.users = res.userName;
            this.eventType = "Event Joiners";
            this.modifyTable();
            this.modalService.open("EventJoinner");
        }, error => {
            console.info('error', error);
        })

    }

    showStaffUserName(days) {
        this.postService.getDashBoardStaffEventJoinners(days).subscribe((res: any) => {
            this.users = res.userName;
            this.eventType = "Staff Event Joiners";
            this.modifyTable();
            this.modalService.open("EventJoinner");
        }, error => {
            console.info('error', error);
        })

    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    getDashBoardCount() {
        this.postService.getDashBoardCount()
            .subscribe((res: any) => {
                this.countData = res;
                this.staffCount[0] = res['twoDayStaffCount']
                this.staffCount[1] = res['threeDayStaffCount']

                this.staffJoinerCount[0] = res['twoDayStaffJoiner']
                this.staffJoinerCount[1] = res['threeDayStaffJoiner']

                res['threeDays'].forEach(three => {
                    if (!this.showCaseData['72']) this.showCaseData['72'] = {};
                    if (three._id) {
                        this.showCaseData['72'].event = three.count;
                        for (var i = 0; i < this.countData.threeDays.length; i++) {
                            if (this.countData.threeDays[i]._id == true) {
                                this.showCaseData['72'].going = this.countData.threeDays[i].goingCount;
                            }
                        }
                    } else {
                        this.showCaseData['72'].feed = three.count;
                    }
                });
                res['towDays'].forEach(three => {
                    if (!this.showCaseData['24']) this.showCaseData['24'] = {};
                    if (three._id) {
                        this.showCaseData['24'].event = three.count;

                        for (var i = 0; i < this.countData.towDays.length; i++) {
                            if (this.countData.threeDays[i]._id == true) {
                                this.showCaseData['24'].going = this.countData.towDays[i].goingCount;
                            }
                        }
                    } else {
                        this.showCaseData['24'].feed = three.count;
                    }
                });
            }, error => {
                console.info('error', error);
            })
    }

    postAnalytics(postdays: any = 7) {
        this.postService.getPostAnalyticsData(postdays).subscribe((res: any) => {
            var labels = [];
            var feedcount = [];
            var eventcount = [];
            for (var key in res) {
                var day = key.split("-");
                var daymon = day[0] + "/" + day[1]
                labels.push(daymon)
                feedcount.push(res[key].feedcount)
                eventcount.push(res[key].eventcount)
            }
            this.year = day[2];

            var dataMultipleBarsChart = {
                labels: labels,
                series: [
                    feedcount,
                    eventcount
                ]
            };

            var optionsMultipleBarsChart = {
                seriesBarDistance: 10,
                axisX: {
                    showGrid: false,
                },
                axisY: {
                    showGrid: false,
                    setInterval: 1,

                },
                height: '300px',
            };

            var responsiveOptionsMultipleBarsChart: any = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    }
                }]
            ];

            var multipleBarsChart = new Chartist.Bar('#multipleBarsChart', dataMultipleBarsChart, optionsMultipleBarsChart, responsiveOptionsMultipleBarsChart);

            //start animation for the Emails Subscription Chart
            this.startAnimationForBarChart(multipleBarsChart);

        }, error => {
            console.info('error', error);
        })
    }
    modifyTable() {
        if (this.staffEventTable) {
            this.staffEventTable.clear();
            this.staffEventTable.destroy();
        }
        this.zone.run(() => {
            this.cdrf.detectChanges();
            this.staffEventTable = $('#staffEventTable').DataTable({
                responsive: true,
                "ordering": false,
                "info": false,
                "searching": false,
                "lengthChange": false,
                "pageLength": 2,
                "dom": '<"top"i>rt<"bottom"p><"clear">'
            });
        });
    }
    startAnimationForLineChart(chart) {
        var seq, delays, durations;
        seq = 0;
        delays = 80;
        durations = 500;
        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    }
    startAnimationForBarChart(chart) {
        var seq2, delays2, durations2;
        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;
    }
    storeReset(reset) {
        console.log(reset);
    }
    ngOnInit() { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.getDashBoardCount();
            this.postAnalytics();
            /* ----------==========     Completed Tasks Chart initialization    ==========---------- */
        }, 300);
    }
}
