import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setCompany(companyMasterID: any){
    localStorage.setItem('company_id', companyMasterID);
  }

  getCompany(){
    return +localStorage.getItem('company_id')
  }

  getLoggedInUser(){
    return +localStorage.getItem('id');
  }
}
