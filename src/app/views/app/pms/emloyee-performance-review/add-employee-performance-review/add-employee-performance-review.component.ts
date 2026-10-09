import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-employee-performance-review',
    templateUrl: './add-employee-performance-review.component.html',
    styleUrls: ['./add-employee-performance-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeePerformanceReviewComponent implements OnInit {
  @ViewChild('addEmployeePerformanceReview') addEmployeePerformanceReview: NgForm;
  company_id: any;
  adminRoot = environment.adminRoot;
  performaceReviewFData: any;
  enddate: Date;
  comp: any = [];

  values: any = [];
  i: any;
  value: any;
  employee: any;
  reviewrs: any;
  selectedUsers: any = [];
  selectedReviewrs: any = [];
  allReviewersBranch: any = [];
  allRevieweeBranch: any = [];
  RevieweeBranchFilter: boolean = false;
  ReviewersBranchFilter: boolean = false;
  RevieweeBranchEmployee: any = [];
  ReviewersBranchEmployee: any = [];
  performanceReview_Id: any;
  temp: any = [];
  selectedids2: any = [];
  tempBranch: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.selectcompany(this.company_id);
  }

  selectcompany(id) {
    if (!id) {
      return;
    }

    this.values = [];
    this.addMoreUsers();

    this.employee = [];
    this.reviewrs = [];

    this.selectedReviewrs = [];
    this.selectedUsers = [];

    this.RevieweeBranchEmployee = [];
    this.ReviewersBranchEmployee = [];

    this.allReviewersBranch = [];
    this.allRevieweeBranch = [];

    this.performanceReview_Id = '';

    this.getPerformaceReviewData(id);
    this.getBranch(id);
    this.getEmployee(id);
  }

  onEmployeeCompany(event: any, i: any) {
    //add users to reviewee branch list
    let selectedItem = this.values[i].selectedUsers;
    this.values.map((item) => {
      if (!this.values[i].RevieweeBranchId && item.RevieweeBranchId) {
        let ids = item.branchRevieeUser.map((e) => e.userMasterID);
        if (selectedItem.length != 0) {
          selectedItem.map((selected) => {
            if (ids.includes(selected)) {
              item.branchRevieeUser = item.branchRevieeUser.filter(
                (item) => item.userMasterID !== selected,
              );
            }
          });
        } else {
          const selectedIds = this.values.map((obj) => obj.selectedUsers).flat();
          this.values.map((item) => {
            item.branchRevieeUser = item.branchRevieeUserTemp.filter(
              (e) => !selectedIds.includes(e.userMasterID),
            );
          });
        }
      }
    });

    //for companyUsers
    const selectedIds = this.values.map((obj) => obj.selectedUsers).flat();
    this.employee = this.temp.filter((e) => !selectedIds.includes(e.userMasterID));
    // this.reviewrs = this.temp.filter((e) => !selectedIds.includes(e.userMasterID));
  }

  onEmployeeRevieweeBranch(event: any, i: any) {
    let branchLeftUsers = [];
    this.values
      .map((obj) => {
        if (obj.RevieweeBranchId === this.values[i].RevieweeBranchId) {
          branchLeftUsers = [...branchLeftUsers, ...obj.selectedUsers];
        }
      })
      .filter(Boolean);
    this.values.map((item) => {
      if (item.RevieweeBranchId === this.values[i].RevieweeBranchId) {
        item.branchRevieeUser = item.branchRevieeUserTemp.filter(
          (e) => !branchLeftUsers.includes(e.userMasterID),
        );
      }
    });

    const selectedIdsExist = this.values.map((obj) => obj.selectedUsers).flat();
    this.employee = this.temp.filter((e) => !selectedIdsExist.includes(e.userMasterID));
  }

  onEmployeeReviewersBranch(event: any, i: any) {
    const selectedIds2 = event.map((item) => {
      return item.userMasterID;
    });

    this.selectedids2.push(...selectedIds2);

    this.values.forEach((obj) => {
      if (obj.branchreviewrsUser && obj.branchreviewrsUser.length > 0) {
        obj.branchreviewrsUser = obj.branchreviewrsUser.filter(
          (item) => !event.some((evt) => evt.userMasterID === item.userMasterID),
        );
      }
    });
  }

  removevalue(i) {
    //branch
    let branchLeftUsers = [];
    this.values
      .map((obj) => {
        if (obj.RevieweeBranchId === this.values[i].RevieweeBranchId) {
          branchLeftUsers = [...branchLeftUsers, ...obj.selectedUsers];
        }
      })
      .filter(Boolean);
    this.values.map((item) => {
      if (item.RevieweeBranchId === this.values[i].RevieweeBranchId) {
        item.branchRevieeUser = item.branchRevieeUserTemp.filter(
          (e) => !branchLeftUsers.includes(e.userMasterID),
        );
      }
    });

    //add users to reviewee branch list
    let selectedItem = this.values[i].selectedUsers;
    this.values.map((item) => {
      if (!this.values[i].RevieweeBranchId && item.RevieweeBranchId) {
        let ids = item.branchRevieeUser.map((e) => e.userMasterID);
        if (selectedItem.length != 0) {
          selectedItem.map((selected) => {
            if (ids.includes(selected)) {
              item.branchRevieeUser = item.branchRevieeUserTemp.filter(
                (item) => item.userMasterID !== selected,
              );
            }
          });
        } else {
          const selectedIds = this.values.map((obj) => obj.selectedUsers).flat();
          this.values.map((item) => {
            item.branchRevieeUser = item.branchRevieeUserTemp.filter(
              (e) => !selectedIds.includes(e.userMasterID),
            );
          });
        }
      } else {
        let branchLeftUsers = [];
        this.values
          .map((obj) => {
            if (obj.RevieweeBranchId === this.values[i].RevieweeBranchId) {
              branchLeftUsers = [...branchLeftUsers, ...obj.selectedUsers];
            }
          })
          .filter(Boolean);

        this.values.map((item) => {
          if (item.RevieweeBranchId === this.values[i].RevieweeBranchId) {
            let removedUsers = [];
            removedUsers = item.branchRevieeUserTemp.filter((e) =>
              branchLeftUsers.includes(e.userMasterID),
            );

            item.branchRevieeUser = [...item.branchRevieeUser, ...removedUsers];
            item.branchRevieeUser = item.branchRevieeUser.filter((obj, index, arr) => {
              return (
                arr.findIndex((innerObj) => innerObj.userMasterID === obj.userMasterID) === index
              );
            });
          }
        });
      }
    });

    //company
    let tempArr = [];
    if (this.values[i].selectedUsers.length != 0 && this.values[i].selectedReviewrs.length != 0) {
      tempArr = [...this.values[i].selectedUsers, ...this.values[i].selectedReviewrs];
    }
    if (this.values[i].selectedUsers.length != 0 && this.values[i].selectedReviewrs.length == 0) {
      tempArr = [...this.values[i].selectedUsers];
    }
    if (this.values[i].selectedUsers.length == 0 && this.values[i].selectedReviewrs.length != 0) {
      tempArr = [...this.values[i].selectedReviewrs];
    }

    if (this.values[i].selectedUsers.length == 0 && this.values[i].selectedReviewrs.length == 0) {
    }

    let final = this.temp.filter((item) => {
      return tempArr.includes(item.userMasterID);
    });

    this.employee = [...this.employee, ...final];
    this.values[i].isDeleted = true;
  }

  getcompany() {
    this.spinner.start('company');
    this.api
      .callApi(
        this.constant.GETALLCOMPANYBYID,
        {
          companyMasterID: localStorage.getItem('company_id'),
        },
        'POST',
        false,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.comp = res.data;
            this.spinner.stop('company');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stop('company');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
        },
      );
  }

  getBranch(id) {
    if (!id) return;

    this.spinner.start('getBranch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.allReviewersBranch = res;
          this.allRevieweeBranch = res;
          this.spinner.stop('getBranch');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getBranch');
        },
      );
  }

  getEmployee(id) {
    if (!id) return;

    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('user');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.temp = res.data;
          this.employee = res.data;
          this.reviewrs = res.data;
          this.spinner.stop('user');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('user');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('user');
      },
    );
  }

  getPerformaceReviewData(company_id: any) {
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETALLPERFORMANCEREVIEW + `?companyMasterID=${company_id}`,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.performaceReviewFData = res.data;
          this.spinner.stop('data');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  selectRevieweeBranch(id: any, i: any) {
    if (!id) {
      this.values[i].ReviewersBranchFilter = false;
      this.values[i].selectedUsers = [];
      // this.selectedids = [];
      this.values[i].branchRevieeUser = this.employee;

      return;
    }
    let bb = {
      branchMasterID: id,
    };

    this.values[i].RevieweeBranchId = id;
    this.values[i].selectedUsers = [];
    this.values[i].RevieweeBranchFilter = true;

    this.spinner.start('branch1');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.values[i].branchRevieeUser = res.data;
          this.values[i].branchRevieeUserTemp = res.data;

          this.tempBranch = res.data;

          let selectedids = [];
          selectedids = this.values.map((obj) => obj.selectedUsers).flat();
          if (selectedids.length > 0) {
            this.values[i].branchRevieeUser = this.values[i].branchRevieeUser.filter(
              (item) => !selectedids.some((evt) => evt === item.userMasterID),
            );
          }

          this.spinner.stop('branch1');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('branch1');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('branch1');
      },
    );
  }

  selectReviewersBranch(id: any, i: any) {
    if (!id) {
      this.values[i].ReviewersBranchFilter = false;
      this.values[i].selectedReviewrs = [];
      this.selectedids2 = [];
      this.values[i].branchRevieeUser = this.reviewrs;

      return;
    }

    let bb = {
      branchMasterID: id,
    };

    this.values[i].ReviewersBranchId = id;
    this.values[i].selectedReviewrs = [];
    this.values[i].ReviewersBranchFilter = true;

    this.spinner.start('branch');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.values[i].branchreviewrsUser = res.data;
          let branchLeftUsers = [];

          const selectedIds1 = this.values
            .map((obj) => {
              if (obj.RevieweeBranchId === this.values[i].RevieweeBranchId) {
                branchLeftUsers = [...branchLeftUsers, ...obj.selectedUsers];
              }
            })
            .filter(Boolean);

          this.values.map((item) => {
            if (item.RevieweeBranchId === this.values[i].RevieweeBranchId) {
              item.branchRevieeUser = item.branchRevieeUserTemp.filter(
                (e) => !branchLeftUsers.includes(e.userMasterID),
              );
            }
          });

          this.selectedids2 = [];

          this.spinner.stop('branch');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('branch');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('branch');
      },
    );
  }

  addMoreUsers() {
    this.values.push({
      branchRevieeUser: [],
      branchreviewrsUser: [],
      RevieweeBranchFilter: false,
      RevieweeBranchId: '',
      branchRevieeUserTemp: [],
      branchreviewrsUserTemp: [],
      ReviewersBranchFilter: false,
      ReviewersBranchId: '',
      user: '',
      reviewr: '',
      notes: '',
      selectedUsers: [],
      selectedReviewrs: [],
      isDeleted: false,
    });
  }

  onSubmit() {
    if (!this.addEmployeePerformanceReview.valid) {
      return;
    }

    let reviewerRevieweeData = [];
    this.values.map((value) => {
      if (!value.isDeleted) {
        const data = {
          reviewees: value.selectedUsers,
          reviewers: value.selectedReviewrs,
        };

        if (value.notes) {
          data['notes'] = value.notes;
        }

        reviewerRevieweeData.push(data);
      }
    });

    if (reviewerRevieweeData.length == 0) return

    const body = {
      performanceReviewId: Number(this.addEmployeePerformanceReview.value.performanceReviewId),
      reviewerRevieweeData,
    };

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.CREATEEMPLOYEEPERFORMANCEREVIEW, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/setPerformanceReview']);
            this.spinner.stop('submit');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('submit');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
