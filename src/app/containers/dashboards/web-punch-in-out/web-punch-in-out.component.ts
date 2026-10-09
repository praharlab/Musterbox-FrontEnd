
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';
import { ElementRef, ViewChild } from '@angular/core';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-web-punch-in-out',
    templateUrl: './web-punch-in-out.component.html',
    styleUrls: ['./web-punch-in-out.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WebPunchInOutComponent implements OnInit {


  @ViewChild('canvasElement') canvasElement: ElementRef;
  @ViewChild('imageElement') imageElement: ElementRef;
  private videoStream: MediaStream | null = null;

  @ViewChild('videoElement') videoElement: ElementRef;

  @ViewChild('closeSelfiePunchInModal') closeSelfiePunchInModal: ElementRef;
  @ViewChild('closeSelfiePunchOutModal') closeSelfiePunchOutModal: ElementRef;

  @ViewChild('closenonSelfiePunchInModal') closenonSelfiePunchInModal: ElementRef;
  @ViewChild('closenonSelfiePunchOutModal') closenonSelfiePunchOutModal: ElementRef;

  @ViewChild('closeselfieCameraModal') closeselfieCameraModal: ElementRef;

  hasCamera = true;
  display: boolean = true;
  logiInUserId: string;
  showloader: boolean = false;
  lastAttedanceStatusData: any = [];
  attedanceBody: any;
  defaultImage: string | '';
  userClickedImage: string | '';
  hideVideo: boolean = false;
  getDashboardCheckData: any = [];
  finalCardData: any = {};
  setClickedImage: string;
  defaultBody: any = {};

  constructor(
    private cameraService: CameraService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit() {
    this.setVariables()
      .then(() => Promise.all([this.getAttendanceData(), this.getDeshboardCheck()]))
      .then(() => this.checkAllData())
      .catch((error) => {
        this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 5000,
          showProgressBar: false,
        });
      });

    const imagePath = '/assets/img/profiles/avatar-default.png';
    this.defaultImageConvertToBase64(imagePath);
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  private setVariables() {
    return new Promise((resolve, reject) => {
      try {
        this.showloader = true;
        this.logiInUserId = localStorage.getItem('id');

        this.defaultBody = {
          userMasterID: localStorage.getItem('id'),
          direction: '',
          newpunchin: false,
          attendnaceFrom: 'web',
          longitude: '',
          latitude: '',
          address: '',
          createBy: localStorage.getItem('id'),
          createByIp: '',
          photo: '',
          battery: '',
          gps: '',
          wifi: '',
          mobilename: '',
        };
        resolve('Variables set successfully');
      } catch (error) {
        this.showloader = false;
        reject(error);
      }
    });
  }

  private checkAllData() {
    if (!this.lastAttedanceStatusData.data.Out_Data && !this.lastAttedanceStatusData.data.In_Data
    ) {
      this.finalCardData = {
        address: '',
        logDateTime: '',
        continuePunchIN: '',
        direction: 'out',
        selfieAttendance: (this.getDashboardCheckData.data.attendancepolicy && this.getDashboardCheckData.data.attendancepolicy.selfieAttendance) ? this.getDashboardCheckData.data.attendancepolicy.selfieAttendance : 0,

      };
    } else {
      const data = this.lastAttedanceStatusData.data.Out_Data ? this.lastAttedanceStatusData.data.Out_Data : this.lastAttedanceStatusData.data.In_Data;
      this.finalCardData = {
        address: data.address,
        logDateTime: data.logDateTime,
        continuePunchIN: this.lastAttedanceStatusData.continuePunchIN,
        direction: data.direction,
        selfieAttendance: (this.getDashboardCheckData.data.attendancepolicy && this.getDashboardCheckData.data.attendancepolicy.selfieAttendance) ? this.getDashboardCheckData.data.attendancepolicy.selfieAttendance : 0,

      };
    }
    this.showloader = false;
  }

  private getAttendanceData(): Promise<void> {
    const body = {
      userMasterID: this.logiInUserId,
    };
    return new Promise<void>((resolve, reject) => {
      this.api.callApi(this.constant.ATTENDACESTATUS_V2, body, 'POST', false, false, true).subscribe(
        (res: any) => {
          this.lastAttedanceStatusData = res;
          resolve();
        },
        (err) => {
          this.showloader = false;
          console.error(err, 'ERROR'); // Log the error
          reject(err); // Reject the Promise in case of an error
        },
      );
    });
  }

  private getDeshboardCheck(): Promise<void> {
    const body = {
      userMasterID: this.logiInUserId,
      deviceType: 'web',
      appVersion: '',
      FirebaseToken: '',
    };
    return new Promise<void>((resolve, reject) => {
      this.api.callApi(this.constant.DESHBOARDCHECK, body, 'POST', false, false, true).subscribe(
        (res: any) => {
          this.getDashboardCheckData = res;
          resolve();
        },
        (err) => {
          this.showloader = false;

          console.error(err, 'ERROR'); // Log the error
          reject(err); // Reject the Promise in case of an error
        },
      );
    });
  }

  public punchIn(punchinStatus: string, selfieStatus: boolean) {
    this.showloader = true;
    this.attedanceBody = {
      ...this.defaultBody,
      newpunchin: punchinStatus === 'newPunchin',
      photo: selfieStatus
        ? this.userClickedImage
          ? this.userClickedImage
          : this.defaultImage
        : '',
      direction: 'in',
    };

    this.addAttedance(selfieStatus, 'in');
  }

  public punchOut(selfieStatus: boolean) {
    this.showloader = true;
    this.attedanceBody = {
      ...this.defaultBody,
      photo: selfieStatus
        ? this.userClickedImage
          ? this.userClickedImage
          : this.defaultImage
        : '',
      direction: 'out',
    };
    this.addAttedance(selfieStatus, 'out');
  }

  private addAttedance(selfieStatus, direction) {
    this.api
      .callApi(this.constant.ATTENDACEAPI, this.attedanceBody, 'POST', false, false, true)
      .subscribe(
        (res: any) => {
          this.handleModalClick(direction, selfieStatus);
          this.showloader = false;
          this.ngOnInit();
          const notificationType =
            res.status === 200 ? NotificationType.Success : NotificationType.Error;

          this.notifications.create(
            res.status === 200 ? 'Done' : 'Attention',
            res.message,
            notificationType,
            {
              theClass: 'outline primary',
              timeOut: 1000,
              showProgressBar: false,
            },
          );
        },
        (err) => {
          this.notifications.create('Error', 'Something Want Wrong!', NotificationType.Success, {
            theClass: 'outline primary',
            timeOut: 1000,
            showProgressBar: false,
          });
          this.handleModalClick(direction, selfieStatus);
          this.showloader = false;
          this.ngOnInit();
        },
      );
  }

  private handleModalClick(direction: string, isSelfie: any): void {
    if (isSelfie) {
      if (direction === 'out') {
        this.closeSelfiePunchOutModal.nativeElement.click();
      } else {
        this.closeSelfiePunchInModal.nativeElement.click();
      }
    } else {
      if (direction === 'out') {
        this.closenonSelfiePunchOutModal.nativeElement.click();
      } else {
        this.closenonSelfiePunchInModal.nativeElement.click();
      }
    }
  }

  //convert defalut image to base64
  private defaultImageConvertToBase64(imagePath: string) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0, img.width, img.height);

      this.defaultImage = canvas.toDataURL('image/png');
      this.setClickedImage = this.defaultImage;
      this.defaultImage = this.defaultImage.split(',')[1];
    };
    img.src = imagePath;
  }

  //Below, 3 functions are for images or selfies.
  async initCamera() {
    try {
      this.showloader = true;
      this.hideVideo = false;
      this.hasCamera = await this.cameraService.hasCamera();
      if (this.hasCamera) {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Attach the stream to the video element
        this.showloader = false;
        this.videoElement.nativeElement.srcObject = this.videoStream;
      } else {
        this.showloader = false;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  public stopCamera() {
    if (this.videoStream) {
      const tracks = this.videoStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    this.imageElement = null;
    this.showloader = false;
  }

  public takeSnapshot() {
    const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      // Set the canvas dimensions to match the video element
      canvas.width = this.videoElement.nativeElement.videoWidth;
      canvas.height = this.videoElement.nativeElement.videoHeight;

      // Draw the current frame from the video onto the canvas
      context.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

      // Get the data URL of the canvas content
      const quality = 0.7; // Adjust the quality as needed
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Get the Base64-encoded image
              const compressedBase64 = reader.result as string;
              this.setClickedImage = compressedBase64;
              this.userClickedImage = compressedBase64.split(',')[1];
              this.hideVideo = true;

              this.stopCamera();
            };
            reader.readAsDataURL(blob);
          }
        },
        'image/jpeg',
        quality,
      );

      this.closeselfieCameraModal.nativeElement.click();
    } else {
      console.error('Canvas context is null. Unable to take a snapshot.');
    }
  }
}


