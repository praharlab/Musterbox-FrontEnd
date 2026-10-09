import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable, Subject, throwError } from 'rxjs';
import { ConstantService } from './constant.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  static callApi(
    arg0: string,
    arg1: undefined[],
    arg2: string,
    arg3: boolean,
    arg4: boolean,
    arg5: boolean,
  ) {
    throw new Error('Method not implemented.');
  }
  private refreshSubject = new Subject<void>();

  private routeSubject = new BehaviorSubject<any>('');
  getRouteSubject$ = this.routeSubject.asObservable();

  private setAddButtonValue = new BehaviorSubject<any>(true);
  getAddButtonValue$ = this.setAddButtonValue.asObservable();

  baseUrl = environment.apiUrl;
  biometricUrl = environment.biometricApiUrl;
  imageUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
    private router: Router,
  ) { }

  // POST_API(endpoint,body){
  //   return this.http.post(this.baseUrl+endpoint,body,{});
  // }

  addRoute(value): void {
    this.routeSubject.next(value);
  }

  addButtonValue(value) : void{
    this.setAddButtonValue.next(value);
  }

  POST_API(endpoint, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };

    return this.http.post(this.baseUrl + endpoint, body, httpOptions);
  }

  GET_API(endpoint) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.http.get(this.baseUrl + endpoint, httpOptions);
  }

  GET_API_body(endpoint, body) {
    return this.http.get(this.baseUrl + endpoint, body);
  }

  PUT_API(endpoint, body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.http.put(this.baseUrl + endpoint, body, httpOptions);
  }
  DELETE_API(endpoint) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.http.delete(this.baseUrl + endpoint, httpOptions);
  }
  uploadFile(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach((f) => formData.append('file', f));

    return this.http.post(this.baseUrl + 'upload_file', formData);
  }

  // ---------------

  private logging(requestUrl: any, requestType: any): void {

  }

  private headerInit(): HttpHeaders {
    let headers: any = new HttpHeaders();
    if (window.localStorage.getItem(this.constant.TOKEN) != null) {
      headers = headers.append(
        'Authorization',
        'Bearer ' + window.localStorage.getItem(this.constant.TOKEN),
      );
    }
    return headers;
  }

  showLoader(isShowLoading: any) {
    if (isShowLoading) {
      this.spinner.start();
    }
  }

  dismissLoader() {
    this.spinner.stop();
  }

  callApi(
    requestUrl: any,
    requestParams: any,
    requestType: any,
    showLoading: Boolean,
    log: Boolean,
    passHeaderToken: Boolean,
    isFile: Boolean = false,
  ): Observable<any> {
    this.showLoader(showLoading);

    let headers: any;
    passHeaderToken ? (headers = this.headerInit()) : (headers = this.headerInit());
    log ? this.logging(requestUrl, requestType) : null;

    if (isFile) {
      if (requestType == 'GET') {
        return this.http.get(this.baseUrl + requestUrl, { responseType: 'blob', headers }).pipe(
          finalize((): void => {
            this.dismissLoader();
          }),
          map((res: any): any => {
            this.dismissLoader();
            if (res.status == 403) {
              this.callSessionTimeOutComponent();
            }
            return res;
          }),
          catchError(this.handleError('error432432', [])),
        );
      } else if (requestType == 'POST') {
        return this.http
          .post(this.baseUrl + requestUrl, requestParams, { responseType: 'blob', headers })
          .pipe(
            finalize((): void => {
              this.dismissLoader();
            }),
            map((res: any): any => {
              this.dismissLoader();
              if (res.status == 403) {
                this.callSessionTimeOutComponent();
              }

              return res;
            }),
            catchError(this.handleError('error432432', [])),
          );
      }
    }
    if (requestType == 'GET' && !isFile) {
      return this.callGETRequest(requestUrl, headers, this.baseUrl);
    }

    if (requestType == 'GET') {
      return this.callGETRequest(requestUrl, headers, this.baseUrl);
    }

    if (requestType == 'POST' && !isFile) {
      return this.callPOSTRequest(requestUrl, requestParams, headers, this.baseUrl);
    }

    if (requestType == 'POST') {
      return this.callPOSTRequest(requestUrl, requestParams, headers, this.baseUrl);
    }

    if (requestType == 'PUT') {
      return this.callPUTRequest(requestUrl, requestParams, headers, this.baseUrl);
    }

    if (requestType == 'DELETE') {
      return this.callDELETERequest(requestUrl, headers, this.baseUrl);
    }
  }

  callBiometricApi(
    requestUrl: any,
    requestParams: any,
    requestType: any,
    showLoading: Boolean,
    log: Boolean,
    passHeaderToken: Boolean,
    isFile: Boolean = false,
  ): Observable<any> {
    this.showLoader(showLoading);

    let headers: any;
    passHeaderToken ? (headers = this.headerInit()) : (headers = this.headerInit());
    log ? this.logging(requestUrl, requestType) : null;

    if (isFile) {
      if (requestType == 'GET') {
        return this.http.get(this.biometricUrl + requestUrl, { responseType: 'blob', headers }).pipe(
          finalize((): void => {
            this.dismissLoader();
          }),
          map((res: any): any => {
            this.dismissLoader();
            if (res.status == 403) {
              this.callSessionTimeOutComponent();
            }
            return res;
          }),
          catchError(this.handleError('error432432', [])),
        );
      } else if (requestType == 'POST') {
        return this.http
          .post(this.biometricUrl + requestUrl, requestParams, { responseType: 'blob', headers })
          .pipe(
            finalize((): void => {
              this.dismissLoader();
            }),
            map((res: any): any => {
              this.dismissLoader();
              if (res.status == 403) {
                this.callSessionTimeOutComponent();
              }

              return res;
            }),
            catchError(this.handleError('error432432', [])),
          );
      }
    }
    if (requestType == 'GET' && !isFile) {
      return this.callGETRequest(requestUrl, headers, this.biometricUrl);
    }

    if (requestType == 'GET') {
      return this.callGETRequest(requestUrl, headers, this.biometricUrl);
    }

    if (requestType == 'POST' && !isFile) {
      return this.callPOSTRequest(requestUrl, requestParams, headers, this.biometricUrl);
    }

    if (requestType == 'POST') {
      return this.callPOSTRequest(requestUrl, requestParams, headers, this.biometricUrl);
    }

    if (requestType == 'PUT') {
      return this.callPUTRequest(requestUrl, requestParams, headers, this.biometricUrl);
    }

    if (requestType == 'DELETE') {
      return this.callDELETERequest(requestUrl, headers, this.biometricUrl);
    }
  }

  callSessionTimeOutComponent() {
    this.refreshSubject.next();
  }

  getRefreshSessionTimeOutObservable() {
    return this.refreshSubject.asObservable();
  }

  callDELETERequest(requestUrl: any, headers: HttpHeaders, baseUrl: any): Observable<any> {
    return this.http.delete<any>(baseUrl + requestUrl, { headers }).pipe(
      finalize((): void => {
        // Hide the loading spinner on success or error
        this.dismissLoader();
      }),
      map((res: any): any => {
        this.dismissLoader();
        if (res.status == 403) {
          this.callSessionTimeOutComponent();
        }
        return res;
      }),
      catchError(this.handleError('error', [])),
    );
  }

  callPUTRequest(requestUrl: any, requestParams: any, headers: HttpHeaders, baseUrl: any): Observable<any> {
    return this.http
      .put<any>(baseUrl + requestUrl, requestParams, {
        headers,
      })
      .pipe(
        finalize((): void => {
          // Hide the loading spinner on success or error
          this.dismissLoader();
        }),
        map((res: any): any => {
          this.dismissLoader();
          if (res.status == 403) {
            this.callSessionTimeOutComponent();
          }
          return res;
        }),
        catchError(this.handleError('error', [])),
      );
  }

  callPOSTRequest(requestUrl: any, requestParams: any, headers: HttpHeaders, baseUrl: any): Observable<any> {
    return this.http
      .post<any>(baseUrl + requestUrl, requestParams, {
        headers,
      })
      .pipe(
        finalize((): void => {
          // Hide the loading spinner on success or error
          this.dismissLoader();
        }),
        map((res: any): any => {
          this.dismissLoader();
          if (res.status == 403) {
            this.callSessionTimeOutComponent();
          }
          return res;
        }),
        catchError(this.handleError('error', [])),
      );
  }

  callGETRequest(requestUrl: any, headers: HttpHeaders, baseUrl: any): Observable<any> {
    return this.http.get<any>(baseUrl + requestUrl, { headers }).pipe(
      finalize((): void => {
        this.dismissLoader();
      }),
      map((res: any): any => {
        this.dismissLoader();
        if (res.status == 403) {
          this.callSessionTimeOutComponent();
        }
        return res;
      }),
      catchError(this.handleError('error', [])),
    );
  }

  private handleError<T>(_operation = 'operation', _result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      if (error.status == 0) {
        // Handle the network error
        console.log('Network error: No internet connection or server unreachable');
      }
      if (error.status == 401) {
        localStorage.clear();
        this.router.navigate(['user/login']);
      }
      if (error.status == 403) {
        this.callSessionTimeOutComponent();
      }
      this.dismissLoader();
      return throwError(() => error);
    };
  }

  customGETApi(url: any) {
    return this.http.get<any>(url).pipe(
      finalize((): void => {
        this.dismissLoader();
      }),
      map((res: any): any => {
        this.dismissLoader();
        return res;
      }),
      catchError(this.handleError('error', [])),
    );
  }
}
