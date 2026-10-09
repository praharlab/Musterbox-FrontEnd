import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-employee-weekoff-policy',
    templateUrl: './view-employee-weekoff-policy.component.html',
    styleUrls: ['./view-employee-weekoff-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewEmployeeWeekoffPolicyComponent implements OnInit {
  weekOffPolicyID: any;
  isNoWeekoffChecked: boolean;
  weekoffTypeValue: any;
  monthlyFixWeekoffValue: any;
  onPresentWeekoffValue: any;

  @Input()
  set getWeekOffPolicyID(getWeekOffPolicyID: any) {
    this.weekOffPolicyID = getWeekOffPolicyID;
  }

  @ViewChild('addcomp') addcomp: any = NgForm;
  adminRoot = environment.adminRoot;

  mondaytable : boolean = false;
  isChecked: any;
  isChecked1: any;
  tuesdaytable: boolean = false;
  isChecked2: any;
  wednesdaytable: boolean = false;
  isChecked3: any;
  thursdaytable: boolean = false;
  isChecked4: any;
  fridaytable: boolean = false;
  isChecked5: any;
  saturdaytable: boolean = false;
  isChecked6: any;
  sundaytable: boolean = false;
  company: any;
  sandwichleave: any;
  checked1: any;
  checked2: any;
  checked3: any;
  checked4: any;
  checked5: any;
  checked6: any;
  checked7: any;
  checked8: any;
  checked9: any;
  checked10: any;
  checked11: any;
  checked12: any;
  checked13: any;
  checked14: any;
  checked15: any;
  checked16: any;
  checked17: any;
  checked18: any;
  checked19: any;
  checked20: any;
  checked21: any;
  checked22: any;
  checked23: any;
  checked24: any;
  checked25: any;
  checked26: any;
  checked27: any;
  checked28: any;
  checked29: any;
  checked30: any;
  checked31: any;
  checked32: any;
  checked33: any;
  checked34: any;
  checked35: any;
  checked36: any;
  checked37: any;
  checked38: any;
  checked39: any;
  checked40: any;
  checked41: any;
  checked42: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.weekOffPolicyID) {
      this.editdata(this.weekOffPolicyID);
      this.getcompany();
    }
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }
  editdata(weekOffPolicyID) {
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWWEEKOFF + weekOffPolicyID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.addcomp.value.weekOffPolicyName = res.data.weekOffPolicyName;
          this.addcomp.value.description = res.data.description;
          this.addcomp.value.companyMasterID = res.data.companyMasterID;
          this.addcomp.value.sandwichLeave = res.data.sandwichLeave;
          this.addcomp.value.BeforeAfterLeave = res.data.BeforeAfterLeave;
          this.sandwichleave = res.data.sandwichLeave;
          this.isNoWeekoffChecked = res.data.isNoWeekoffPolicy;

          this.weekoffTypeValue = !this.isNoWeekoffChecked ? res.data.weekoffType : null;
          this.monthlyFixWeekoffValue = res.data.monthlyFix;
          this.onPresentWeekoffValue = res.data.presentDays;
          
          for (var i = 0; i < res.data.weekOffOptions.length; i++) {
            if (res.data.weekOffOptions[i].day == 'monday') {
              // this.isChecked=true;
              this.addcomp.value.monday = true;
              this.mondaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'allmonday') {
                  this.addcomp.value.allmonday = true;
                  this.addcomp.value.ruleallmonday = res.data.weekOffOptions[i].options[j].option;
                  this.checked1 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1stmonday') {
                  this.addcomp.value.w1stmonday = true;
                  this.addcomp.value.rule1stmonday = res.data.weekOffOptions[i].options[j].option;
                  this.checked2 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndmonday') {
                  this.addcomp.value.w2ndmonday = true;
                  this.addcomp.value.rule2ndmonday = res.data.weekOffOptions[i].options[j].option;
                  this.checked3 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdmonday') {
                  this.addcomp.value.w3rdmonday = true;
                  this.addcomp.value.rule3rdmonday = res.data.weekOffOptions[i].options[j].option;
                  this.checked4 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4thmonday') {
                  this.addcomp.value.w4thmonday = true;
                  this.addcomp.value.rule4thmonday = res.data.weekOffOptions[i].options[j].option;
                  this.checked5 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5thmonday') {
                  this.addcomp.value.w5thmonday = true;
                  this.addcomp.value.rule5thmonday = res.data.weekOffOptions[i].options[j].option;
                  this.checked6 = true;
                }
              }
            }
            if (res.data.weekOffOptions[i].day == 'tuesday') {
              // this.isChecked1=true;
              this.addcomp.value.tuesday = true;
              this.tuesdaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'alltuesday') {
                  this.addcomp.value.alltuesday = true;
                  this.addcomp.value.rulealltuesday = res.data.weekOffOptions[i].options[j].option;
                  this.checked7 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1sttuesday') {
                  this.addcomp.value.w1sttuesday = true;
                  this.addcomp.value.rule1sttuesday = res.data.weekOffOptions[i].options[j].option;
                  this.checked8 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndtuesday') {
                  this.addcomp.value.w2ndtuesday = true;
                  this.addcomp.value.rule2ndtuesday = res.data.weekOffOptions[i].options[j].option;
                  this.checked9 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdtuesday') {
                  this.addcomp.value.w3rdtuesday = true;
                  this.addcomp.value.rule3rdtuesday = res.data.weekOffOptions[i].options[j].option;
                  this.checked10 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4thtuesday') {
                  this.addcomp.value.w4thtuesday = true;
                  this.addcomp.value.rule4thtuesday = res.data.weekOffOptions[i].options[j].option;
                  this.checked11 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5thtuesday') {
                  this.addcomp.value.w5thtuesday = true;
                  this.addcomp.value.rule5thtuesday = res.data.weekOffOptions[i].options[j].option;
                  this.checked12 = true;
                }
              }
            }
            if (res.data.weekOffOptions[i].day == 'wednesday') {
              // this.isChecked2=true;
              this.addcomp.value.wednesday = true;
              this.wednesdaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'allwednesday') {
                  this.addcomp.value.allwednesday = true;
                  this.addcomp.value.ruleallwednesday =
                    res.data.weekOffOptions[i].options[j].option;
                  this.checked13 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1stwednesday') {
                  this.addcomp.value.w1stwednesday = true;
                  this.addcomp.value.rule1stwednesday =
                    res.data.weekOffOptions[i].options[j].option;
                  this.checked14 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndwednesday') {
                  this.addcomp.value.w2ndwednesday = true;
                  this.addcomp.value.rule2ndwednesday =
                    res.data.weekOffOptions[i].options[j].option;
                  this.checked15 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdwednesday') {
                  this.addcomp.value.w3rdwednesday = true;
                  this.addcomp.value.rule3rdwednesday =
                    res.data.weekOffOptions[i].options[j].option;
                  this.checked16 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4thwednesday') {
                  this.addcomp.value.w4thwednesday = true;
                  this.addcomp.value.rule4thwednesday =
                    res.data.weekOffOptions[i].options[j].option;
                  this.checked17 = true;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5thwednesday') {
                  this.addcomp.value.w5thwednesday = true;
                  this.addcomp.value.rule5thwednesday =
                    res.data.weekOffOptions[i].options[j].option;
                  this.checked18 = true;
                }
              }
            }
            if (res.data.weekOffOptions[i].day == 'thursday') {
              // this.isChecked3=true;
              this.addcomp.value.thursday = true;
              this.thursdaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'allthursday') {
                  this.addcomp.value.allthursday = true;
                  this.checked19 = true;
                  this.addcomp.value.ruleallthursday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1stthursday') {
                  this.addcomp.value.w1stthursday = true;
                  this.checked20 = true;
                  this.addcomp.value.rule1stthursday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndthursday') {
                  this.addcomp.value.w2ndthursday = true;
                  this.checked21 = true;
                  this.addcomp.value.rule2ndthursday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdthursday') {
                  this.addcomp.value.w3rdthursday = true;
                  this.checked22 = true;
                  this.addcomp.value.rule3rdthursday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4ththursday') {
                  this.addcomp.value.w4ththursday = true;
                  this.checked23 = true;
                  this.addcomp.value.rule4ththursday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5ththursday') {
                  this.addcomp.value.w5ththursday = true;
                  this.checked24 = true;
                  this.addcomp.value.rule5ththursday = res.data.weekOffOptions[i].options[j].option;
                }
              }
            }
            if (res.data.weekOffOptions[i].day == 'friday') {
              // this.isChecked4=true;
              this.addcomp.value.friday = true;
              this.fridaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'allfriday') {
                  this.addcomp.value.allfriday = true;
                  this.checked25 = true;
                  this.addcomp.value.ruleallfriday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1stfriday') {
                  this.addcomp.value.w1stfriday = true;
                  this.checked26 = true;
                  this.addcomp.value.rule1stfriday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndfriday') {
                  this.addcomp.value.w2ndfriday = true;
                  this.checked27 = true;
                  this.addcomp.value.rule2ndfriday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdfriday') {
                  this.addcomp.value.w3rdfriday = true;
                  this.checked28 = true;
                  this.addcomp.value.rule3rdfriday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4thfriday') {
                  this.addcomp.value.w4thfriday = true;
                  this.checked29 = true;
                  this.addcomp.value.rule4thfriday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5thfriday') {
                  this.addcomp.value.w5thfriday = true;
                  this.checked30 = true;
                  this.addcomp.value.rule5thfriday = res.data.weekOffOptions[i].options[j].option;
                }
              }
            }
            if (res.data.weekOffOptions[i].day == 'saturday') {
              // this.isChecked5=true;
              this.addcomp.value.saturday = true;
              this.saturdaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'allsaturday') {
                  this.addcomp.value.allsaturday = true;
                  this.checked31 = true;
                  this.addcomp.value.ruleallsaturday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1stsaturday') {
                  this.addcomp.value.w1stsaturday = true;
                  this.checked32 = true;
                  this.addcomp.value.rule1stsaturday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndsaturday') {
                  this.addcomp.value.w2ndsaturday = true;
                  this.checked33 = true;
                  this.addcomp.value.rule2ndsaturday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdsaturday') {
                  this.addcomp.value.w3rdsaturday = true;
                  this.checked34 = true;
                  this.addcomp.value.rule3rdsaturday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4thsaturday') {
                  this.addcomp.value.w4thsaturday = true;
                  this.checked35 = true;
                  this.addcomp.value.rule4thsaturday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5thsaturday') {
                  this.addcomp.value.w5thsaturday = true;
                  this.checked36 = true;
                  this.addcomp.value.rule5thsaturday = res.data.weekOffOptions[i].options[j].option;
                }
              }
            }
            if (res.data.weekOffOptions[i].day == 'sunday') {
              // this.isChecked6=true;
              this.addcomp.value.sunday = true;
              this.sundaytable = true;
              for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
                if (res.data.weekOffOptions[i].options[j].name == 'allsunday') {
                  this.addcomp.value.allsunday = true;
                  this.checked37 = true;
                  this.addcomp.value.ruleallsunday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '1stsunday') {
                  this.addcomp.value.w1stsunday = true;
                  this.checked38 = true;
                  this.addcomp.value.rule1stsunday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '2ndsunday') {
                  this.addcomp.value.w2ndsunday = true;
                  this.checked39 = true;
                  this.addcomp.value.rule2ndsunday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '3rdsunday') {
                  this.addcomp.value.w3rdsunday = true;
                  this.checked40 = true;
                  this.addcomp.value.rule3rdsunday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '4thsunday') {
                  this.addcomp.value.w4thsunday = true;
                  this.checked41 = true;
                  this.addcomp.value.rule4thsunday = res.data.weekOffOptions[i].options[j].option;
                }
                if (res.data.weekOffOptions[i].options[j].name == '5thsunday') {
                  this.addcomp.value.w5thsunday = true;
                  this.checked42 = true;
                  this.addcomp.value.rule5thsunday = res.data.weekOffOptions[i].options[j].option;
                }
              }
            }
          }
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }


  isNoWeekoff(evt) {
    this.isNoWeekoffChecked = evt.target.checked;

    if (evt.target.checked == true) {
      this.isChecked = false;
      this.isChecked1 = false;
      this.isChecked2 = false;
      this.isChecked3 = false;
      this.isChecked4 = false;
      this.isChecked5 = false;
      this.isChecked6 = false;

      this.mondaytable = false;
      this.tuesdaytable = false;
      this.wednesdaytable = false;
      this.thursdaytable = false;
      this.fridaytable = false;
      this.saturdaytable = false;
      this.sundaytable = false;

    }

  }

  // changedmonday(evt) {
  //   this.isChecked = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.mondaytable = true;
  //   } else {
  //     this.mondaytable = false;
  //     this.checked1 = evt.target.checked;
  //     this.checked2 = evt.target.checked;
  //     this.checked3 = evt.target.checked;
  //     this.checked4 = evt.target.checked;
  //     this.checked5 = evt.target.checked;
  //     this.checked6 = evt.target.checked;
  //   }
  // }
  // changedtuesday(evt) {
  //   this.isChecked1 = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.tuesdaytable = true;
  //   } else {
  //     this.tuesdaytable = false;
  //     this.checked7 = evt.target.checked;
  //     this.checked8 = evt.target.checked;
  //     this.checked9 = evt.target.checked;
  //     this.checked10 = evt.target.checked;
  //     this.checked11 = evt.target.checked;
  //     this.checked12 = evt.target.checked;
  //   }
  // }
  // changedwednesday(evt) {
  //   this.isChecked2 = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.wednesdaytable = true;
  //   } else {
  //     this.wednesdaytable = false;
  //     this.checked13 = evt.target.checked;
  //     this.checked14 = evt.target.checked;
  //     this.checked15 = evt.target.checked;
  //     this.checked16 = evt.target.checked;
  //     this.checked17 = evt.target.checked;
  //     this.checked18 = evt.target.checked;
  //   }
  // }
  // changedthursday(evt) {
  //   this.isChecked3 = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.thursdaytable = true;
  //   } else {
  //     this.thursdaytable = false;
  //     this.checked19 = evt.target.checked;
  //     this.checked20 = evt.target.checked;
  //     this.checked21 = evt.target.checked;
  //     this.checked22 = evt.target.checked;
  //     this.checked23 = evt.target.checked;
  //     this.checked24 = evt.target.checked;
  //   }
  // }
  // changedfriday(evt) {
  //   this.isChecked4 = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.fridaytable = true;
  //   } else {
  //     this.fridaytable = false;
  //     this.checked25 = evt.target.checked;
  //     this.checked26 = evt.target.checked;
  //     this.checked27 = evt.target.checked;
  //     this.checked28 = evt.target.checked;
  //     this.checked29 = evt.target.checked;
  //     this.checked30 = evt.target.checked;
  //   }
  // }
  // changedsaturday(evt) {
  //   this.isChecked5 = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.saturdaytable = true;
  //   } else {
  //     this.saturdaytable = false;
  //     this.checked31 = evt.target.checked;
  //     this.checked32 = evt.target.checked;
  //     this.checked33 = evt.target.checked;
  //     this.checked34 = evt.target.checked;
  //     this.checked35 = evt.target.checked;
  //     this.checked36 = evt.target.checked;
  //   }
  // }
  // changedsunday(evt) {
  //   this.isChecked6 = evt.target.checked;
  //   if (evt.target.checked == true) {
  //     this.sundaytable = true;
  //   } else {
  //     this.sundaytable = false;
  //     this.checked37 = evt.target.checked;
  //     this.checked38 = evt.target.checked;
  //     this.checked39 = evt.target.checked;
  //     this.checked40 = evt.target.checked;
  //     this.checked41 = evt.target.checked;
  //     this.checked42 = evt.target.checked;
  //   }
  // }
 
  sandwich(event) {
    this.sandwichleave = event.target.checked;
  }

}
