import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserFormValueStorageService {
  private storageKey = 'formUserID';
  private encryptionKey = environment.firebase.apiKey;
  adminRoot = environment.adminRoot;

  constructor(private router: Router) {}

  private getStoredData(): any {
    const encryptedData = sessionStorage.getItem(this.storageKey);

    if (encryptedData) {
      try {
        const decryptedData = this.decryption(encryptedData, this.encryptionKey);
        return decryptedData || null;
      } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
      }
    }
    return null;
  }

  private updateStoredData(id: number | string): void {
    const encryptedData = this.encryption(id, this.encryptionKey);
    sessionStorage.setItem(this.storageKey, encryptedData);
  }

  getData(): number | string | null {
    return this.getStoredData();
  }

  addData(id: number | string): void {
    this.updateStoredData(id);
  }

  removeData(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  navigate(route: string, id: number | string) {
    this.addData(id);
    this.router.navigate([`${this.adminRoot}${route}`]);
  }

  clearData(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  isEmptyObject(): boolean {
    const data = this.getStoredData();
    return data === null;
  }

  private encryption(data: any, key: string): string {
    const jsonString = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, key).toString();
    return encryptedData;
  }

  private decryption(encryptedData: string, key: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  }
}
