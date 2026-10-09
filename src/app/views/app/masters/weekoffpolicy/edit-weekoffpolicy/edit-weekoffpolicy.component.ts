import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-weekoffpolicy',
    templateUrl: './edit-weekoffpolicy.component.html',
    styleUrls: ['./edit-weekoffpolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditWeekoffpolicyComponent implements OnInit {
  @ViewChild('addcomp') addcomp: any = NgForm;
  adminRoot = environment.adminRoot;

  validateDays: any = {}
  mondaytable = false;
  isChecked: boolean = false
  isChecked1: boolean = false
  tuesdaytable: boolean = false;
  isChecked2: boolean = false
  wednesdaytable: boolean = false;
  isChecked3: boolean = false
  thursdaytable: boolean = false;
  isChecked4: boolean = false
  fridaytable: boolean = false;
  isChecked5: boolean = false
  saturdaytable: boolean = false;
  isChecked6: boolean = false
  sundaytable: boolean = false;
  abc: any;
  ipAddress: any;
  company: any;
  sandwichleave: any;
  childcompany: string;
  checked1: boolean = false;
  checked2: boolean = false;
  checked3: boolean = false;
  checked4: boolean = false;
  checked5: boolean = false;
  checked6: boolean = false;
  checked7: boolean = false;
  checked8: boolean = false;
  checked9: boolean = false;
  checked10: boolean = false;
  checked11: boolean = false;
  checked12: boolean = false;
  checked13: boolean = false;
  checked14: boolean = false;
  checked15: boolean = false;
  checked16: boolean = false;
  checked17: boolean = false;
  checked18: boolean = false;
  checked19: boolean = false;
  checked20: boolean = false;
  checked21: boolean = false;
  checked22: boolean = false;
  checked23: boolean = false;
  checked24: boolean = false;
  checked25: boolean = false;
  checked26: boolean = false;
  checked27: boolean = false;
  checked28: boolean = false;
  checked29: boolean = false;
  checked30: boolean = false;
  checked31: boolean = false;
  checked32: boolean = false;
  checked33: boolean = false;
  checked34: boolean = false;
  checked35: boolean = false;
  checked36: boolean = false;
  checked37: boolean = false;
  checked38: boolean = false;
  checked39: boolean = false;
  checked40: boolean = false;
  checked41: boolean = false;
  checked42: boolean = false;

  formValue: any;
  isNoWeekoffChecked: boolean;
  weekoffTypeValue: any;
  monthlyFixWeekoffValue: any;
  onPresentWeekoffValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {

    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.getIPAddress();
    this.editdata();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
        },
      );
  }

  isValidValue(num) {
    return num >= 0 && num <= 30 && num % 0.5 === 0;
  }


  setWeekoffType(event: any) {
    if (event) {
      if (event.target.value == 'fix') {
        this.monthlyFixWeekoffValue = null
        this.onPresentWeekoffValue = null

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

        this.checked1 = false;
        this.checked2 = false;
        this.checked3 = false;
        this.checked4 = false;
        this.checked5 = false;
        this.checked6 = false;

        this.checked7 = false;
        this.checked8 = false;
        this.checked9 = false;
        this.checked10 = false;
        this.checked11 = false;
        this.checked12 = false;

        this.checked13 = false;
        this.checked14 = false;
        this.checked15 = false;
        this.checked16 = false;
        this.checked17 = false;
        this.checked18 = false;

        this.checked19 = false;
        this.checked20 = false;
        this.checked21 = false;
        this.checked22 = false;
        this.checked23 = false;
        this.checked24 = false;

        this.checked25 = false;
        this.checked26 = false;
        this.checked27 = false;
        this.checked28 = false;
        this.checked29 = false;
        this.checked30 = false;

        this.checked31 = false;
        this.checked32 = false;
        this.checked33 = false;
        this.checked34 = false;
        this.checked35 = false;
        this.checked36 = false;

        this.checked37 = false;
        this.checked38 = false;
        this.checked39 = false;
        this.checked40 = false;
        this.checked41 = false;
        this.checked42 = false;
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

  editdata() {
    let companyid = this.formValue.ListWeekoffpolicyComponent.id;
    this.spinner.start('getdata');
    this.api.callApi(this.constant.VIEWWEEKOFF + companyid, {}, 'GET', false, true, true).subscribe(
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
            this.isChecked = true
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
            this.isChecked1=true;
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
            this.isChecked2=true;
            this.addcomp.value.wednesday = true;
            this.wednesdaytable = true;
            for (var j = 0; j < res.data.weekOffOptions[i].options.length; j++) {
              if (res.data.weekOffOptions[i].options[j].name == 'allwednesday') {
                this.addcomp.value.allwednesday = true;
                this.addcomp.value.ruleallwednesday = res.data.weekOffOptions[i].options[j].option;
                this.checked13 = true;
              }
              if (res.data.weekOffOptions[i].options[j].name == '1stwednesday') {
                this.addcomp.value.w1stwednesday = true;
                this.addcomp.value.rule1stwednesday = res.data.weekOffOptions[i].options[j].option;
                this.checked14 = true;
              }
              if (res.data.weekOffOptions[i].options[j].name == '2ndwednesday') {
                this.addcomp.value.w2ndwednesday = true;
                this.addcomp.value.rule2ndwednesday = res.data.weekOffOptions[i].options[j].option;
                this.checked15 = true;
              }
              if (res.data.weekOffOptions[i].options[j].name == '3rdwednesday') {
                this.addcomp.value.w3rdwednesday = true;
                this.addcomp.value.rule3rdwednesday = res.data.weekOffOptions[i].options[j].option;
                this.checked16 = true;
              }
              if (res.data.weekOffOptions[i].options[j].name == '4thwednesday') {
                this.addcomp.value.w4thwednesday = true;
                this.addcomp.value.rule4thwednesday = res.data.weekOffOptions[i].options[j].option;
                this.checked17 = true;
              }
              if (res.data.weekOffOptions[i].options[j].name == '5thwednesday') {
                this.addcomp.value.w5thwednesday = true;
                this.addcomp.value.rule5thwednesday = res.data.weekOffOptions[i].options[j].option;
                this.checked18 = true;
              }
            }
          }
          if (res.data.weekOffOptions[i].day == 'thursday') {
            this.isChecked3=true;
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
            this.isChecked4=true;
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
            this.isChecked5=true;
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
            this.isChecked6=true;
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
        this.spinner.stop('getdata');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('getdata');
      },
    );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
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
      if(!this.isChecked && !this.isChecked1 && !this.isChecked2 && !this.isChecked3 && !this.isChecked4 && !this.isChecked5 && !this.isChecked6 ) return;

      this.abc = this.addcomp.value;

      if (this.addcomp.value.monday == true) {
        if (this.addcomp.value.allmonday == true) {
          options.push({ name: 'allmonday', option: this.addcomp.value.ruleallmonday });
        }
        if (this.abc.w1stmonday == true) {
          options.push({ name: '1stmonday', option: this.addcomp.value.rule1stmonday });
        }
        if (this.addcomp.value.w2ndmonday == true) {
          options.push({ name: '2ndmonday', option: this.addcomp.value.rule2ndmonday });
        }
        if (this.addcomp.value.w3rdmonday == true) {
          options.push({ name: '3rdmonday', option: this.addcomp.value.rule3rdmonday });
        }
        if (this.addcomp.value.w4thmonday == true) {
          options.push({ name: '4thmonday', option: this.addcomp.value.rule4thmonday });
        }
        if (this.addcomp.value.w5thmonday == true) {
          options.push({ name: '5thmonday', option: this.addcomp.value.rule5thmonday });
        }
        weekOffOptions.push({ day: 'monday', options: options });
        this.validateDays.validMonday = options.length > 0 ? true : false;
      }
      if (this.addcomp.value.tuesday == true) {
        if (this.addcomp.value.alltuesday == true) {
          options1.push({ name: 'alltuesday', option: this.addcomp.value.rulealltuesday });
        }
        if (this.abc.w1sttuesday == true) {
          options1.push({ name: '1sttuesday', option: this.addcomp.value.rule1sttuesday });
        }
        if (this.addcomp.value.w2ndtuesday == true) {
          options1.push({ name: '2ndtuesday', option: this.addcomp.value.rule2ndtuesday });
        }
        if (this.addcomp.value.w3rdtuesday == true) {
          options1.push({ name: '3rdtuesday', option: this.addcomp.value.rule3rdtuesday });
        }
        if (this.addcomp.value.w4thtuesday == true) {
          options1.push({ name: '4thtuesday', option: this.addcomp.value.rule4thtuesday });
        }
        if (this.addcomp.value.w5thtuesday == true) {
          options1.push({ name: '5thtuesday', option: this.addcomp.value.rule5thtuesday });
        }
        weekOffOptions.push({ day: 'tuesday', options: options1 });
        this.validateDays.validTuesday = options1.length > 0 ? true : false;
      }
      if (this.addcomp.value.wednesday == true) {
        if (this.addcomp.value.allwednesday == true) {
          options2.push({ name: 'allwednesday', option: this.addcomp.value.ruleallwednesday });
        }
        if (this.abc.w1stwednesday == true) {
          options2.push({ name: '1stwednesday', option: this.addcomp.value.rule1stwednesday });
        }
        if (this.addcomp.value.w2ndwednesday == true) {
          options2.push({ name: '2ndwednesday', option: this.addcomp.value.rule2ndwednesday });
        }
        if (this.addcomp.value.w3rdwednesday == true) {
          options2.push({ name: '3rdwednesday', option: this.addcomp.value.rule3rdwednesday });
        }
        if (this.addcomp.value.w4thwednesday == true) {
          options2.push({ name: '4thwednesday', option: this.addcomp.value.rule4thwednesday });
        }
        if (this.addcomp.value.w5thwednesday == true) {
          options2.push({ name: '5thwednesday', option: this.addcomp.value.rule5thwednesday });
        }
        weekOffOptions.push({ day: 'wednesday', options: options2 });
        this.validateDays.validWednesday = options2.length > 0 ? true : false;
      }
      if (this.addcomp.value.thursday == true) {
        if (this.addcomp.value.allthursday == true) {
          options3.push({ name: 'allthursday', option: this.addcomp.value.ruleallthursday });
        }
        if (this.abc.w1stthursday == true) {
          options3.push({ name: '1stthursday', option: this.addcomp.value.rule1stthursday });
        }
        if (this.addcomp.value.w2ndthursday == true) {
          options3.push({ name: '2ndthursday', option: this.addcomp.value.rule2ndthursday });
        }
        if (this.addcomp.value.w3rdthursday == true) {
          options3.push({ name: '3rdthursday', option: this.addcomp.value.rule3rdthursday });
        }
        if (this.addcomp.value.w4ththursday == true) {
          options3.push({ name: '4ththursday', option: this.addcomp.value.rule4ththursday });
        }
        if (this.addcomp.value.w5ththursday == true) {
          options3.push({ name: '5ththursday', option: this.addcomp.value.rule5ththursday });
        }
        weekOffOptions.push({ day: 'thursday', options: options3 });
        this.validateDays.validThursday = options3.length > 0 ? true : false;
      }
      if (this.addcomp.value.friday == true) {
        if (this.addcomp.value.allfriday == true) {
          options4.push({ name: 'allfriday', option: this.addcomp.value.ruleallfriday });
        }
        if (this.abc.w1stfriday == true) {
          options4.push({ name: '1stfriday', option: this.addcomp.value.rule1stfriday });
        }
        if (this.addcomp.value.w2ndfriday == true) {
          options4.push({ name: '2ndfriday', option: this.addcomp.value.rule2ndfriday });
        }
        if (this.addcomp.value.w3rdfriday == true) {
          options4.push({ name: '3rdfriday', option: this.addcomp.value.rule3rdfriday });
        }
        if (this.addcomp.value.w4thfriday == true) {
          options4.push({ name: '4thfriday', option: this.addcomp.value.rule4thfriday });
        }
        if (this.addcomp.value.w5thfriday == true) {
          options4.push({ name: '5thfriday', option: this.addcomp.value.rule5thfriday });
        }
        weekOffOptions.push({ day: 'friday', options: options4 });
        this.validateDays.validFriday = options4.length > 0 ? true : false;
      }
      if (this.addcomp.value.saturday == true) {
        if (this.addcomp.value.allsaturday == true) {
          options5.push({ name: 'allsaturday', option: this.addcomp.value.ruleallsaturday });
        }
        if (this.abc.w1stsaturday == true) {
          options5.push({ name: '1stsaturday', option: this.addcomp.value.rule1stsaturday });
        }
        if (this.addcomp.value.w2ndsaturday == true) {
          options5.push({ name: '2ndsaturday', option: this.addcomp.value.rule2ndsaturday });
        }
        if (this.addcomp.value.w3rdsaturday == true) {
          options5.push({ name: '3rdsaturday', option: this.addcomp.value.rule3rdsaturday });
        }
        if (this.addcomp.value.w4thsaturday == true) {
          options5.push({ name: '4thsaturday', option: this.addcomp.value.rule4thsaturday });
        }
        if (this.addcomp.value.w5thsaturday == true) {
          options5.push({ name: '5thsaturday', option: this.addcomp.value.rule5thsaturday });
        }
        weekOffOptions.push({ day: 'saturday', options: options5 });
        this.validateDays.validSaturday = options5.length > 0 ? true : false;
      }
      if (this.addcomp.value.sunday == true) {
        if (this.addcomp.value.allsunday == true) {
          options6.push({ name: 'allsunday', option: this.addcomp.value.ruleallsunday });
        }
        if (this.abc.w1stsunday == true) {
          options6.push({ name: '1stsunday', option: this.addcomp.value.rule1stsunday });
        }
        if (this.addcomp.value.w2ndsunday == true) {
          options6.push({ name: '2ndsunday', option: this.addcomp.value.rule2ndsunday });
        }
        if (this.addcomp.value.w3rdsunday == true) {
          options6.push({ name: '3rdsunday', option: this.addcomp.value.rule3rdsunday });
        }
        if (this.addcomp.value.w4thsunday == true) {
          options6.push({ name: '4thsunday', option: this.addcomp.value.rule4thsunday });
        }
        if (this.addcomp.value.w5thsunday == true) {
          options6.push({ name: '5thsunday', option: this.addcomp.value.rule5thsunday });
        }
        weekOffOptions.push({ day: 'sunday', options: options6 });
        this.validateDays.validSunday = options6.length > 0 ? true : false;
      }

      // if(this.addcomp.value.allmonday == true && options.length == 0){
      //   return;
      // }

      // if(this.addcomp.value.alltuesday == true && options1.length == 0){
      //   return;
      // }

      // if(this.addcomp.value.allwednesday == true && options2.length == 0){
      //   return;
      // }

      // if(this.addcomp.value.allthursday == true && options3.length == 0){
      //   return;
      // }

      // if(this.addcomp.value.allfriday == true && options4.length == 0){
      //   return;
      // }

      // if(this.addcomp.value.allsaturday == true && options5.length == 0){
      //   return;
      // }

      // if(this.addcomp.value.allsunday == true && options6.length == 0){
      //   return;
      // }
      if (Object.values(this.validateDays).includes(false)) return;

    }

    if (this.weekoffTypeValue == 'monthlyFix') {
      if (!this.isValidValue(+this.monthlyFixWeekoffValue)) return this.notValidMessage();
    }

    if (this.weekoffTypeValue == 'onPresentDay') {
      if (!this.isValidValue(+this.onPresentWeekoffValue)) return this.notValidMessage();
    }

    let body = {
      weekOffPolicyID: this.formValue.ListWeekoffpolicyComponent.id,
      weekOffPolicyName: this.addcomp.value.weekOffPolicyName,
      description: this.addcomp.value.description,
      weekOffOptions: this.weekoffTypeValue == 'fix' ? weekOffOptions : [],
      companyMasterID: this.addcomp.value.companyMasterID,
      weekoffType: this.weekoffTypeValue,
      monthlyFix: this.weekoffTypeValue == 'monthlyFix' ? this.monthlyFixWeekoffValue : null,
      presentDays: this.weekoffTypeValue == 'onPresentDay' ? this.onPresentWeekoffValue : null,
      isNoWeekoffPolicy: this.isNoWeekoffChecked

    };

    this.spinner.start();
    this.api.callApi(this.constant.UPDATEWORKPOLICY, body, 'POST', true, true, true).subscribe(
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


    // if (evt.target.checked == true) {
    //   this.mondaytable = true;
    // } else {
    //   this.mondaytable = false;
    // }
  }


  changedmonday(evt) {
    this.isChecked = evt.target.checked;
    if (evt.target.checked == true) {
      this.mondaytable = true;
    } else {
      this.mondaytable = false;
      this.checked1 = evt.target.checked;
      this.checked2 = evt.target.checked;
      this.checked3 = evt.target.checked;
      this.checked4 = evt.target.checked;
      this.checked5 = evt.target.checked;
      this.checked6 = evt.target.checked;
    }
  }
  changedtuesday(evt) {
    this.isChecked1 = evt.target.checked;
    if (evt.target.checked == true) {
      this.tuesdaytable = true;
    } else {
      this.tuesdaytable = false;
      this.checked7 = evt.target.checked;
      this.checked8 = evt.target.checked;
      this.checked9 = evt.target.checked;
      this.checked10 = evt.target.checked;
      this.checked11 = evt.target.checked;
      this.checked12 = evt.target.checked;
    }
  }
  changedwednesday(evt) {
    this.isChecked2 = evt.target.checked;
    if (evt.target.checked == true) {
      this.wednesdaytable = true;
    } else {
      this.wednesdaytable = false;
      this.checked13 = evt.target.checked;
      this.checked14 = evt.target.checked;
      this.checked15 = evt.target.checked;
      this.checked16 = evt.target.checked;
      this.checked17 = evt.target.checked;
      this.checked18 = evt.target.checked;
    }
  }
  changedthursday(evt) {
    this.isChecked3 = evt.target.checked;
    if (evt.target.checked == true) {
      this.thursdaytable = true;
    } else {
      this.thursdaytable = false;
      this.checked19 = evt.target.checked;
      this.checked20 = evt.target.checked;
      this.checked21 = evt.target.checked;
      this.checked22 = evt.target.checked;
      this.checked23 = evt.target.checked;
      this.checked24 = evt.target.checked;
    }
  }
  changedfriday(evt) {
    this.isChecked4 = evt.target.checked;
    if (evt.target.checked == true) {
      this.fridaytable = true;
    } else {
      this.fridaytable = false;
      this.checked25 = evt.target.checked;
      this.checked26 = evt.target.checked;
      this.checked27 = evt.target.checked;
      this.checked28 = evt.target.checked;
      this.checked29 = evt.target.checked;
      this.checked30 = evt.target.checked;
    }
  }
  changedsaturday(evt) {
    this.isChecked5 = evt.target.checked;
    if (evt.target.checked == true) {
      this.saturdaytable = true;
    } else {
      this.saturdaytable = false;
      this.checked31 = evt.target.checked;
      this.checked32 = evt.target.checked;
      this.checked33 = evt.target.checked;
      this.checked34 = evt.target.checked;
      this.checked35 = evt.target.checked;
      this.checked36 = evt.target.checked;
    }
  }
  changedsunday(evt) {
    this.isChecked6 = evt.target.checked;
    if (evt.target.checked == true) {
      this.sundaytable = true;
    } else {
      this.sundaytable = false;
      this.checked37 = evt.target.checked;
      this.checked38 = evt.target.checked;
      this.checked39 = evt.target.checked;
      this.checked40 = evt.target.checked;
      this.checked41 = evt.target.checked;
      this.checked42 = evt.target.checked;
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  sandwich(event) {
    this.sandwichleave = event.target.checked;
  }

  changeAllMonday(event: any) {
    this.checked1 = event;
    if (event == false) {
      this.checked2 = false
      this.checked3 = false
      this.checked4 = false
      this.checked5 = false
      this.checked6 = false
    }

  }
  change1Monday(event: any) {
    this.checked2 = event;
  }
  change2Monday(event: any) {
    this.checked3 = event;
  }
  change3Monday(event: any) {
    this.checked4 = event;
  }
  change4Monday(event: any) {
    this.checked5 = event;
  }
  change5Monday(event: any) {
    this.checked6 = event;
  }
  changeAllTuesday(event: any) {
    this.checked7 = event;
    if (event == false) {
      this.checked8 = false;
      this.checked9 = false;
      this.checked10 = false;
      this.checked11 = false;
      this.checked12 = false;
    }
  }
  change1Tuesday(event: any) {
    this.checked8 = event;
  }
  change2Tuesday(event: any) {
    this.checked9 = event;
  }
  change3Tuesday(event: any) {
    this.checked10 = event;
  }
  change4Tuesday(event: any) {
    this.checked11 = event;
  }
  change5Tuesday(event: any) {
    this.checked12 = event;
  }
  changeAllWednesday(event: any) {
    this.checked13 = event;
    if (event == false) {
      this.checked14 = false
      this.checked15 = false
      this.checked16 = false
      this.checked17 = false
      this.checked18 = false
    }
  }
  change1Wednesday(event: any) {
    this.checked14 = event;
  }
  change2Wednesday(event: any) {
    this.checked15 = event;
  }
  change3Wednesday(event: any) {
    this.checked16 = event;
  }
  change4Wednesday(event: any) {
    this.checked17 = event;
  }
  change5Wednesday(event: any) {
    this.checked18 = event;
  }
  changeAllThursday(event: any) {
    this.checked19 = event;
    if (event == false) {
      this.checked20 = false
      this.checked21 = false
      this.checked22 = false
      this.checked23 = false
      this.checked24 = false
    }
  }
  change1Thursday(event: any) {
    this.checked20 = event;
  }
  change2Thursday(event: any) {
    this.checked21 = event;
  }
  change3Thursday(event: any) {
    this.checked22 = event;
  }
  change4Thursday(event: any) {
    this.checked23 = event;
  }
  change5Thursday(event: any) {
    this.checked24 = event;
  }
  changeAllFriday(event: any) {
    this.checked25 = event;
    if (event == false) {
      this.checked26 = false;
      this.checked27 = false;
      this.checked28 = false;
      this.checked29 = false;
      this.checked30 = false;
    }
  }
  change1Friday(event: any) {
    this.checked26 = event;
  }
  change2Friday(event: any) {
    this.checked27 = event;
  }
  change3Friday(event: any) {
    this.checked28 = event;
  }
  change4Friday(event: any) {
    this.checked29 = event;
  }
  change5Friday(event: any) {
    this.checked30 = event;
  }
  changeAllSaturday(event: any) {
    this.checked31 = event;
    if (event == false) {
      this.checked32 = false;
      this.checked33 = false;
      this.checked34 = false;
      this.checked35 = false;
      this.checked36 = false;
    }
  }
  change1Saturday(event: any) {
    this.checked32 = event;
  }
  change2Saturday(event: any) {
    this.checked33 = event;
  }
  change3Saturday(event: any) {
    this.checked34 = event;
  }
  change4Saturday(event: any) {
    this.checked35 = event;
  }
  change5Saturday(event: any) {
    this.checked36 = event;
  }
  changeAllSunday(event: any) {
    this.checked37 = event;
    if (event == false) {
      this.checked38 = false;
      this.checked39 = false;
      this.checked40 = false;
      this.checked41 = false;
      this.checked42 = false;
    }
  }
  change1Sunday(event: any) {
    this.checked38 = event;
  }
  change2Sunday(event: any) {
    this.checked39 = event;
  }
  change3Sunday(event: any) {
    this.checked40 = event;
  }
  change4Sunday(event: any) {
    this.checked41 = event;
  }
  change5Sunday(event: any) {
    this.checked42 = event;
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
