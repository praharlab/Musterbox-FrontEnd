import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-weekoffpolicy',
    templateUrl: './add-weekoffpolicy.component.html',
    styleUrls: ['./add-weekoffpolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddWeekoffpolicyComponent implements OnInit {
  @ViewChild('addweekoff') addweekoff: any = NgForm;
  adminRoot = environment.adminRoot;

  validateDays: any = {}
  mondaytable = false;
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
  addweekoffform: any;
  ipAddress: any;
  isChecked7: boolean = false;
  isChecked8: boolean = false;
  isChecked9: boolean = false;
  isChecked10: boolean = false;
  isChecked11: boolean = false;
  isChecked12: boolean = false;
  isChecked13: boolean = false;
  isChecked14: boolean = false;
  isChecked15: boolean = false;
  isChecked16: boolean = false;
  isChecked17: boolean = false;
  isChecked18: boolean = false;
  isChecked19: boolean = false;
  isChecked20: boolean = false;
  isChecked21: boolean = false;
  isChecked22: boolean = false;
  isChecked23: boolean = false;
  isChecked24: boolean = false;
  isChecked25: boolean = false;
  isChecked26: boolean = false;
  isChecked27: boolean = false;
  isChecked28: boolean = false;
  isChecked29: boolean = false;
  isChecked30: boolean = false;
  isChecked31: boolean = false;
  isChecked32: boolean = false;
  isChecked33: boolean = false;
  isChecked34: boolean = false;
  isChecked35: boolean = false;
  isChecked36: boolean = false;
  isChecked37: boolean = false;
  isChecked38: boolean = false;
  isChecked39: boolean = false;
  isChecked40: boolean = false;
  isChecked41: boolean = false;
  isChecked42: boolean = false;
  isChecked43: boolean = false;
  isChecked44: boolean = false;
  isChecked45: boolean = false;
  isChecked46: boolean = false;
  isChecked47: boolean = false;
  isChecked48: boolean = false;
  mondayanothertable: boolean;
  tuesdayanothertable: boolean;
  wednesdayanothertable: boolean;
  thursdayanothertable: boolean;
  fridayanothertable: boolean;
  saturdayanothertable: boolean;
  sundayanothertable: boolean;
  company: any;
  childcompany: string;
  sandwichleave: any;
  isNoWeekoffChecked: boolean = false;
  weekoffTypeValue: any;
  monthlyFixWeekoffValue: any;
  onPresentWeekoffValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.getIPAddress();
    this.getcompany();
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

  isValidValue(num) {
    return num >= 0 && num <= 30 && num % 0.5 === 0;
  }


  setWeekoffType(event: any) {
    if (event) {
      if (event.target.value == 'fix') {
        this.monthlyFixWeekoffValue = null
        this.onPresentWeekoffValue = null
        this.isChecked = false
        this.isChecked1 = false
        this.isChecked2 = false
        this.isChecked3 = false
        this.isChecked4 = false
        this.isChecked5 = false
        this.isChecked6 = false

        this.mondaytable = false
        this.tuesdaytable = false
        this.wednesdaytable = false
        this.thursdaytable = false
        this.fridaytable = false
        this.saturdaytable = false
        this.sundaytable = false

        this.isChecked7 = false
        this.isChecked8 = false
        this.isChecked9 = false
        this.isChecked10 = false
        this.isChecked11 = false
        this.isChecked12 = false

        this.isChecked13 = false
        this.isChecked14 = false
        this.isChecked15 = false
        this.isChecked16 = false
        this.isChecked17 = false
        this.isChecked18 = false

        this.isChecked19 = false;
        this.isChecked20 = false;
        this.isChecked21 = false;
        this.isChecked22 = false;
        this.isChecked23 = false;
        this.isChecked24 = false;

        this.isChecked25 = false
        this.isChecked26 = false
        this.isChecked27 = false
        this.isChecked28 = false
        this.isChecked29 = false
        this.isChecked30 = false

        this.isChecked31 = false
        this.isChecked32 = false
        this.isChecked33 = false
        this.isChecked34 = false
        this.isChecked35 = false
        this.isChecked36 = false

        this.isChecked37 = false
        this.isChecked38 = false
        this.isChecked39 = false
        this.isChecked40 = false
        this.isChecked41 = false
        this.isChecked42 = false

        this.isChecked43 = false
        this.isChecked44 = false
        this.isChecked45 = false
        this.isChecked46 = false
        this.isChecked47 = false
        this.isChecked48 = false
      }

      if (event.target.value == 'monthlyFix') {
        this.onPresentWeekoffValue = null

      }

      if (event.target.value == 'onPresentDay') {
        this.monthlyFixWeekoffValue = null
      }

      this.weekoffTypeValue = event.target.value;
    }

  }

  notValidMessage() {
    this.notifications.create('Validation', 'Enter Valid Value!', NotificationType.Error, {
      theClass: 'outline danger',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  onSubmit() {
    if (!this.addweekoff.valid) {
      return;
    }

    const weekOffOptions = [];
    const options = [];
    const options1 = [];
    const options2 = [];
    const options3 = [];
    const options4 = [];
    const options5 = [];
    const options6 = [];

    if (!this.isNoWeekoffChecked && this.weekoffTypeValue == 'fix') {

      this.addweekoffform = this.addweekoff.value;
      if (this.addweekoff.value.BeforeAfterLeave == '') {
        this.addweekoff.value.BeforeAfterLeave = null;
      }
      if (this.addweekoff.value.sandwichLeave == '') {
        this.addweekoff.value.sandwichLeave = null;
      }


      if (this.addweekoff.value.monday == true) {
        if (this.addweekoff.value.allmonday == true) {
          options.push({
            name: 'allmonday',
            option: this.addweekoff.value.ruleallmonday,
          });
        }
        if (this.addweekoff.value.w1stmonday == true) {
          options.push({
            name: '1stmonday',
            option: this.addweekoff.value.rule1stmonday,
          });
        }
        if (this.addweekoff.value.w2ndmonday == true) {
          options.push({
            name: '2ndmonday',
            option: this.addweekoff.value.rule2ndmonday,
          });
        }
        if (this.addweekoff.value.w3rdmonday == true) {
          options.push({
            name: '3rdmonday',
            option: this.addweekoff.value.rule3rdmonday,
          });
        }
        if (this.addweekoff.value.w4thmonday == true) {
          options.push({
            name: '4thmonday',
            option: this.addweekoff.value.rule4thmonday,
          });
        }
        if (this.addweekoff.value.w5thmonday == true) {
          options.push({
            name: '5thmonday',
            option: this.addweekoff.value.rule5thmonday,
          });
        }
        weekOffOptions.push({ day: 'monday', options: options });
        this.validateDays.validMonday = options.length > 0 ? true : false;
      }
      if (this.addweekoff.value.tuesday == true) {
        if (this.addweekoff.value.alltuesday == true) {
          options1.push({
            name: 'alltuesday',
            option: this.addweekoff.value.rulealltuesday,
          });
        }
        if (this.addweekoff.value.w1sttuesday == true) {
          options1.push({
            name: '1sttuesday',
            option: this.addweekoff.value.rule1sttuesday,
          });
        }
        if (this.addweekoff.value.w2ndtuesday == true) {
          options1.push({
            name: '2ndtuesday',
            option: this.addweekoff.value.rule2ndtuesday,
          });
        }
        if (this.addweekoff.value.w3rdtuesday == true) {
          options1.push({
            name: '3rdtuesday',
            option: this.addweekoff.value.rule3rdtuesday,
          });
        }
        if (this.addweekoff.value.w4thtuesday == true) {
          options1.push({
            name: '4thtuesday',
            option: this.addweekoff.value.rule4thtuesday,
          });
        }
        if (this.addweekoff.value.w5thtuesday == true) {
          options1.push({
            name: '5thtuesday',
            option: this.addweekoff.value.rule5thtuesday,
          });
        }
        weekOffOptions.push({ day: 'tuesday', options: options1 });
        this.validateDays.validTuesday = options1.length > 0 ? true : false;
      }
      if (this.addweekoff.value.wednesday == true) {
        if (this.addweekoff.value.allwednesday == true) {
          options2.push({
            name: 'allwednesday',
            option: this.addweekoff.value.ruleallwednesday,
          });
        }
        if (this.addweekoff.value.w1stwednesday == true) {
          options2.push({
            name: '1stwednesday',
            option: this.addweekoff.value.rule1stwednesday,
          });
        }
        if (this.addweekoff.value.w2ndwednesday == true) {
          options2.push({
            name: '2ndwednesday',
            option: this.addweekoff.value.rule2ndwednesday,
          });
        }
        if (this.addweekoff.value.w3rdwednesday == true) {
          options2.push({
            name: '3rdwednesday',
            option: this.addweekoff.value.rule3rdwednesday,
          });
        }
        if (this.addweekoff.value.w4thwednesday == true) {
          options2.push({
            name: '4thwednesday',
            option: this.addweekoff.value.rule4thwednesday,
          });
        }
        if (this.addweekoff.value.w5thwednesday == true) {
          options2.push({
            name: '5thwednesday',
            option: this.addweekoff.value.rule5thwednesday,
          });
        }
        weekOffOptions.push({ day: 'wednesday', options: options2 });
        this.validateDays.validWednesday = options2.length > 0 ? true : false;
      }
      if (this.addweekoff.value.thursday == true) {
        if (this.addweekoff.value.allthursday == true) {
          options3.push({
            name: 'allthursday',
            option: this.addweekoff.value.ruleallthursday,
          });
        }
        if (this.addweekoff.value.w1stthursday == true) {
          options3.push({
            name: '1stthursday',
            option: this.addweekoff.value.rule1stthursday,
          });
        }
        if (this.addweekoff.value.w2ndthursday == true) {
          options3.push({
            name: '2ndthursday',
            option: this.addweekoff.value.rule2ndthursday,
          });
        }
        if (this.addweekoff.value.w3rdthursday == true) {
          options3.push({
            name: '3rdthursday',
            option: this.addweekoff.value.rule3rdthursday,
          });
        }
        if (this.addweekoff.value.w4ththursday == true) {
          options3.push({
            name: '4ththursday',
            option: this.addweekoff.value.rule4ththursday,
          });
        }
        if (this.addweekoff.value.w5ththursday == true) {
          options3.push({
            name: '5ththursday',
            option: this.addweekoff.value.rule5ththursday,
          });
        }
        weekOffOptions.push({ day: 'thursday', options: options3 });
        this.validateDays.validThursday = options3.length > 0 ? true : false;
      }
      if (this.addweekoff.value.friday == true) {
        if (this.addweekoff.value.allfriday == true) {
          options4.push({
            name: 'allfriday',
            option: this.addweekoff.value.ruleallfriday,
          });
        }
        if (this.addweekoff.value.w1stfriday == true) {
          options4.push({
            name: '1stfriday',
            option: this.addweekoff.value.rule1stfriday,
          });
        }
        if (this.addweekoff.value.w2ndfriday == true) {
          options4.push({
            name: '2ndfriday',
            option: this.addweekoff.value.rule2ndfriday,
          });
        }
        if (this.addweekoff.value.w3rdfriday == true) {
          options4.push({
            name: '3rdfriday',
            option: this.addweekoff.value.rule3rdfriday,
          });
        }
        if (this.addweekoff.value.w4thfriday == true) {
          options4.push({
            name: '4thfriday',
            option: this.addweekoff.value.rule4thfriday,
          });
        }
        if (this.addweekoff.value.w5thfriday == true) {
          options4.push({
            name: '5thfriday',
            option: this.addweekoff.value.rule5thfriday,
          });
        }
        weekOffOptions.push({ day: 'friday', options: options4 });
        this.validateDays.validFriday = options4.length > 0 ? true : false;
      }
      if (this.addweekoff.value.saturday == true) {
        if (this.addweekoff.value.allsaturday == true) {
          options5.push({
            name: 'allsaturday',
            option: this.addweekoff.value.ruleallsaturday,
          });
        }
        if (this.addweekoff.value.w1stsaturday == true) {
          options5.push({
            name: '1stsaturday',
            option: this.addweekoff.value.rule1stsaturday,
          });
        }
        if (this.addweekoff.value.w2ndsaturday == true) {
          options5.push({
            name: '2ndsaturday',
            option: this.addweekoff.value.rule2ndsaturday,
          });
        }
        if (this.addweekoff.value.w3rdsaturday == true) {
          options5.push({
            name: '3rdsaturday',
            option: this.addweekoff.value.rule3rdsaturday,
          });
        }
        if (this.addweekoff.value.w4thsaturday == true) {
          options5.push({
            name: '4thsaturday',
            option: this.addweekoff.value.rule4thsaturday,
          });
        }
        if (this.addweekoff.value.w5thsaturday == true) {
          options5.push({
            name: '5thsaturday',
            option: this.addweekoff.value.rule5thsaturday,
          });
        }
        weekOffOptions.push({ day: 'saturday', options: options5 });
        this.validateDays.validSaturday = options5.length > 0 ? true : false;
      }
      if (this.addweekoff.value.sunday == true) {
        if (this.addweekoff.value.allsunday == true) {
          options6.push({
            name: 'allsunday',
            option: this.addweekoff.value.ruleallsunday,
          });
        }
        if (this.addweekoff.value.w1stsunday == true) {
          options6.push({
            name: '1stsunday',
            option: this.addweekoff.value.rule1stsunday,
          });
        }
        if (this.addweekoff.value.w2ndsunday == true) {
          options6.push({
            name: '2ndsunday',
            option: this.addweekoff.value.rule2ndsunday,
          });
        }
        if (this.addweekoff.value.w3rdsunday == true) {
          options6.push({
            name: '3rdsunday',
            option: this.addweekoff.value.rule3rdsunday,
          });
        }
        if (this.addweekoff.value.w4thsunday == true) {
          options6.push({
            name: '4thsunday',
            option: this.addweekoff.value.rule4thsunday,
          });
        }
        if (this.addweekoff.value.w5thsunday == true) {
          options6.push({
            name: '5thsunday',
            option: this.addweekoff.value.rule5thsunday,
          });
        }
        weekOffOptions.push({ day: 'sunday', options: options6 });
        this.validateDays.validSunday = options6.length > 0 ? true : false;
      }

    }

    if (Object.values(this.validateDays).includes(false) || !this.addweekoff.valid) return;

    if (this.weekoffTypeValue == 'monthlyFix') {
      if (!this.isValidValue(+this.monthlyFixWeekoffValue)) return this.notValidMessage();
    }

    if (this.weekoffTypeValue == 'onPresentDay') {
      if (!this.isValidValue(+this.onPresentWeekoffValue)) return this.notValidMessage();
    }

    let body;
    if (this.childcompany == 'false') {
      body = {
        weekOffPolicyName: this.addweekoff.value.weekOffPolicyName,
        description: this.addweekoff.value.description,
        weekOffOptions: this.weekoffTypeValue == 'fix' ? weekOffOptions : [],
        companyMasterID: this.addweekoff.value.companyMasterID,
        status: '1',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        weekoffType: this.weekoffTypeValue,
        monthlyFix: this.weekoffTypeValue == 'monthlyFix' ? this.monthlyFixWeekoffValue : null,
        presentDays: this.weekoffTypeValue == 'onPresentDay' ? this.onPresentWeekoffValue : null,
        isNoWeekoffPolicy: this.isNoWeekoffChecked
      };
    } else {
      body = {
        weekOffPolicyName: this.addweekoff.value.weekOffPolicyName,
        description: this.addweekoff.value.description,
        weekOffOptions: this.weekoffTypeValue == 'fix' ? weekOffOptions : [],
        companyMasterID: localStorage.getItem('company_id'),
        status: '1',
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
        weekoffType: this.weekoffTypeValue,
        monthlyFix: this.weekoffTypeValue == 'monthlyFix' ? this.monthlyFixWeekoffValue : null,
        presentDays: this.weekoffTypeValue == 'onPresentDay' ? this.onPresentWeekoffValue : null,
        isNoWeekoffPolicy: this.isNoWeekoffChecked
      };
    }


    console.log(body, 'body');


    this.spinner.start();
    this.api.callApi(this.constant.CREATEweekoffpolicy, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/weekoffpolicy']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  //  Handle Week Off Checkbox 
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
      this.weekoffTypeValue = null;
    }
  }

  // -------------------------- Handle Week Off Day's ----------------------------------

  //  Handle Check Monday Week Off 
  changedmonday(evt) {
    this.isChecked = evt.target.checked;
    if (evt.target.checked == true) {
      this.mondaytable = true;
      this.mondayanothertable = true;
    } else {
      this.isChecked7 = false
      this.isChecked8 = false
      this.isChecked9 = false
      this.isChecked10 = false
      this.isChecked11 = false
      this.isChecked12 = false
      this.mondaytable = false;
    }
  }

  //  Check All Monday
  changedallmonday(evt) {
    this.isChecked7 = evt.target.checked;
    if (evt.target.checked == true) {
      this.mondayanothertable = false;
      // this.sundayanothertable = true;
    } else {
      this.isChecked8 = false
      this.isChecked9 = false
      this.isChecked10 = false
      this.isChecked11 = false
      this.isChecked12 = false
      this.addweekoff.value.ruleallmonday = '';

      this.mondayanothertable = true;
    }
  }

  // Handle First Monday
  changed1stmonday(evt) {

    this.isChecked8 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1stmonday = '';
    }
  }

  // Handle Second Monday
  changed2ndmonday(evt) {

    this.isChecked9 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndmonday = '';
    }
  }

  // Handle Third Monday
  changed3rdmonday(evt) {

    this.isChecked10 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdmonday = '';
    }
  }

  // Handle Fourthd Monday
  changed4thmonday(evt) {

    this.isChecked11 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4thmonday = '';
    }
  }

  // Handle Fifth Monday
  changed5thmonday(evt) {

    this.isChecked12 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5thmonday = '';
    }
  }

  //  Handle Check Tuesady Week Off
  changedtuesday(evt) {
    this.isChecked1 = evt.target.checked;
    if (evt.target.checked == true) {
      this.tuesdaytable = true;
      this.tuesdayanothertable = true;
    } else {
      this.isChecked13 = false
      this.isChecked14 = false
      this.isChecked15 = false
      this.isChecked16 = false
      this.isChecked17 = false
      this.isChecked18 = false
      this.tuesdaytable = false;
    }
  }

  //  Check All Tuesday
  changedalltuesday(evt) {
    this.isChecked13 = evt.target.checked;

    if (evt.target.checked == true) {
      this.tuesdayanothertable = false;
    } else {
      this.addweekoff.value.rulealltuesday = '';
      this.isChecked13 = false
      this.isChecked14 = false
      this.isChecked15 = false
      this.isChecked16 = false
      this.isChecked17 = false
      this.isChecked18 = false
      this.tuesdayanothertable = true;
    }
  }
  // Handle First Tuesday
  changed1sttuesday(evt) {

    this.isChecked14 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1sttuesday = '';
    }
  }

  // Handle Second Tuesday
  changed2ndtuesday(evt) {

    this.isChecked15 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndtuesday = '';
    }
  }

  // Handle Third Tuesday
  changed3rdtuesday(evt) {

    this.isChecked16 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdtuesday = '';
    }
  }

  // Handle Fourth Tuesday
  changed4thtuesday(evt) {

    this.isChecked17 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4thtuesday = '';
    }
  }

  // Handle Fifth Tuesday
  changed5thtuesday(evt) {

    this.isChecked18 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5thtuesday = '';
    }
  }

  //  Handle Check Wednesday Week Off
  changedwednesday(evt) {
    this.isChecked2 = evt.target.checked;
    if (evt.target.checked == true) {
      this.wednesdaytable = true;
      this.wednesdayanothertable = true;
    } else {
      this.isChecked19 = false;
      this.isChecked20 = false;
      this.isChecked21 = false;
      this.isChecked22 = false;
      this.isChecked23 = false;
      this.isChecked24 = false;
      this.wednesdaytable = false;
    }
  }

  changedallwednesday(evt) {

    this.isChecked19 = evt.target.checked;

    if (evt.target.checked == true) {
      this.wednesdayanothertable = false;
    } else {
      this.isChecked19 = false;
      this.isChecked20 = false;
      this.isChecked21 = false;
      this.isChecked22 = false;
      this.isChecked23 = false;
      this.isChecked24 = false;
      this.addweekoff.value.ruleallwednesday = '';
      this.wednesdayanothertable = true;
    }
  }
  changed1stwednesday(evt) {

    this.isChecked20 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1stwednesday = '';
    }
  }
  changed2ndwednesday(evt) {

    this.isChecked21 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndwednesday = '';
    }
  }
  changed3rdwednesday(evt) {

    this.isChecked22 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdwednesday = '';
    }
  }
  changed4thwednesday(evt) {

    this.isChecked23 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4thwednesday = '';
    }
  }
  changed5thwednesday(evt) {

    this.isChecked24 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5thwednesday = '';
    }
  }

  //  Handle Check Thursday Week Off
  changedthursday(evt) {
    this.isChecked3 = evt.target.checked;
    if (evt.target.checked == true) {
      this.thursdaytable = true;
      this.thursdayanothertable = true;
    } else {
      this.isChecked25 = false
      this.isChecked26 = false
      this.isChecked27 = false
      this.isChecked28 = false
      this.isChecked29 = false
      this.isChecked30 = false
      this.thursdaytable = false;
    }
  }

  changedallthursday(evt) {

    this.isChecked25 = evt.target.checked;

    if (evt.target.checked == true) {
      this.thursdayanothertable = false;
    } else {
      this.isChecked25 = false
      this.isChecked26 = false
      this.isChecked27 = false
      this.isChecked28 = false
      this.isChecked29 = false
      this.isChecked30 = false
      this.addweekoff.value.ruleallthursday = '';
      this.thursdayanothertable = true;
    }
  }
  changed1stthursday(evt) {

    this.isChecked26 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1stthursday = '';
    }
  }
  changed2ndthursday(evt) {

    this.isChecked27 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndthursday = '';
    }
  }
  changed3rdthursday(evt) {

    this.isChecked28 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdthursday = '';
    }
  }
  changed4ththursday(evt) {

    this.isChecked29 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4ththursday = '';
    }
  }
  changed5ththursday(evt) {

    this.isChecked30 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5ththursday = '';
    }
  }

  //  Handle Check Friday Week Off
  changedfriday(evt) {
    this.isChecked4 = evt.target.checked;
    if (evt.target.checked == true) {
      this.fridaytable = true;
      this.fridayanothertable = true;
    } else {
      this.isChecked31 = false
      this.isChecked32 = false
      this.isChecked33 = false
      this.isChecked34 = false
      this.isChecked35 = false
      this.isChecked36 = false
      this.fridaytable = false;
    }
  }

  changedallfriday(evt) {

    this.isChecked31 = evt.target.checked;

    if (evt.target.checked == true) {
      this.fridayanothertable = false;
    } else {
      this.isChecked31 = false
      this.isChecked32 = false
      this.isChecked33 = false
      this.isChecked34 = false
      this.isChecked35 = false
      this.isChecked36 = false
      this.addweekoff.value.ruleallfriday = '';
      this.fridayanothertable = true;
    }
  }
  changed1stfriday(evt) {

    this.isChecked32 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1stfriday = '';
    }
  }
  changed2ndfriday(evt) {

    this.isChecked33 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndfriday = '';
    }
  }
  changed3rdfriday(evt) {

    this.isChecked34 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdfriday = '';
    }
  }
  changed4thfriday(evt) {

    this.isChecked35 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4thfriday = '';
    }
  }
  changed5thfriday(evt) {

    this.isChecked36 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5thfriday = '';
    }
  }


  //  Handle Check Saturday Week Off
  changedsaturday(evt) {
    this.isChecked5 = evt.target.checked;
    if (evt.target.checked == true) {
      this.saturdaytable = true;
      this.saturdayanothertable = true;
    } else {
      this.isChecked37 = false
      this.isChecked38 = false
      this.isChecked39 = false
      this.isChecked40 = false
      this.isChecked41 = false
      this.isChecked42 = false
      this.saturdaytable = false;
    }
  }

  changedallsaturday(evt) {

    this.isChecked37 = evt.target.checked;

    if (evt.target.checked == true) {
      this.saturdayanothertable = false;
    } else {
      this.isChecked37 = false
      this.isChecked38 = false
      this.isChecked39 = false
      this.isChecked40 = false
      this.isChecked41 = false
      this.isChecked42 = false
      this.addweekoff.value.ruleallsaturday = '';
      this.saturdayanothertable = true;
    }
  }
  changed1stsaturday(evt) {

    this.isChecked38 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1stsaturday = '';
    }
  }
  changed2ndsaturday(evt) {

    this.isChecked39 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndsaturday = '';
    }
  }
  changed3rdsaturday(evt) {

    this.isChecked40 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdsaturday = '';
    }
  }
  changed4thsaturday(evt) {

    this.isChecked41 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4thsaturday = '';
    }
  }
  changed5thsaturday(evt) {

    this.isChecked42 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5thsaturday = '';
    }
  }


  //  Handle Check Sunday Week Off
  changedsunday(evt) {
    this.isChecked6 = evt.target.checked;
    if (evt.target.checked == true) {
      this.sundaytable = true;
      this.sundayanothertable = true
    } else {
      this.isChecked43 = false
      this.isChecked44 = false
      this.isChecked45 = false
      this.isChecked46 = false
      this.isChecked47 = false
      this.isChecked48 = false
      this.sundaytable = false;
    }
  }

  changedallsunday(evt) {
    this.isChecked43 = evt.target.checked;
    if (evt.target.checked == true) {
      this.sundayanothertable = false;
    } else {
      this.isChecked43 = false
      this.isChecked44 = false
      this.isChecked45 = false
      this.isChecked46 = false
      this.isChecked47 = false
      this.isChecked48 = false
      this.addweekoff.value.ruleallsunday = '';
      this.sundayanothertable = true;
    }
  }

  changed1stsunday(evt) {

    this.isChecked44 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule1stsunday = '';
    }
  }

  changed2ndsunday(evt) {

    this.isChecked45 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule2ndsunday = '';
    }
  }

  changed3rdsunday(evt) {

    this.isChecked46 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule3rdsunday = '';
    }
  }

  changed4thsunday(evt) {

    this.isChecked47 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule4thsunday = '';
    }
  }

  changed5thsunday(evt) {

    this.isChecked48 = evt.target.checked;

    if (evt.target.checked == false) {
      this.addweekoff.value.rule5thsunday = '';
    }
  }

  // ------------------------------------------------------------
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  sandwich(event) {
    this.sandwichleave = event.target.checked;
  }
}
