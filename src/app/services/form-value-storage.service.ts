import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class FormValueStorageService {
  // Define a private class-level variable to store the key for accessing data in storage.
  private storageKey = 'formValue';

  // Initialize an empty object to store data retrieved from storage.
  data: any = {};

  // Define a private class-level variable to store the encryption key, typically fetched from the environment configuration.
  private encryptionKey = environment.firebase.apiKey;

  // Store the root URL for the admin environment from the environment configuration.
  adminRoot = environment.adminRoot;

  constructor(private router: Router) {}

  /**
   * Retrieves stored data from session storage, decrypts it, and returns it.
   * If no data is found or decryption fails, an empty object is returned.
   * @returns Decrypted data or an empty object
   */
  private getStoredData(): any {
    // Retrieve encrypted data from session storage using the storage key
    const encryptedData = sessionStorage.getItem(this.storageKey);

    // Check if encrypted data exists
    if (encryptedData) {
      try {
        // Attempt to decrypt the data using the provided encryption key
        const decryptedData = this.decryption(encryptedData, this.encryptionKey);

        // If decryption is successful, return the decrypted data, or an empty object if decryption result is falsy
        return decryptedData || {};
      } catch (error) {
        // If an error occurs during decryption, log the error and return an empty object
        console.error('Error decrypting data:', error);
        return {};
      }
    }

    // If no encrypted data is found, return an empty object
    return {};
  }

  /**
   * Updates the stored data in sessionStorage after encrypting it.
   * @param data The data to be stored.
   */
  private updateStoredData(data: any): void {
    // Encrypt the data using the provided encryption method and key
    const encryptedData = this.encryption(data, this.encryptionKey);

    // Store the encrypted data in sessionStorage using the provided storage key
    sessionStorage.setItem(this.storageKey, encryptedData);
  }

  /**
   * Retrieves data from storage.
   *
   * @returns {any} The stored data.
   */
  getData(): any {
    return this.getStoredData();
  }

  /**
   * Adds data to the stored data object under the specified component name.
   * @param {string} componentName - The name of the component to which data will be added.
   * @param {any} item - The data item to be added.
   * @returns {void}
   */
  addData(componentName: string, item: any): void {
    // Retrieve the stored data object
    const data = this.getStoredData();

    // Add the new data item under the specified component name
    data[componentName] = item;

    // Update the stored data with the modified object
    this.updateStoredData(data);
  }

  /**
   * Removes data associated with a component.
   * @param {string} componentName - The name of the component whose data is to be removed.
   * @param {boolean} deleteID - A flag indicating whether to delete the entire component entry.
   *                              If true, deletes the entire entry; if false, only removes the 'body' property.
   * @returns {void}
   */
  removeData(componentName: string, deleteID: boolean): void {
    // Retrieve stored data
    const data = this.getStoredData();

    // Check if the component name exists in the stored data and if it has a 'body' property
    if (data[componentName] && data[componentName]['body']) {
      // If 'body' property exists, delete it
      delete data[componentName]['body'];
    }

    // If deleteID flag is true, delete the entire component entry
    if (deleteID) {
      delete data[componentName];
    }

    // Update the stored data after modifications
    this.updateStoredData(data);
  }
  removeComponentData(componentName: string, deleteID: boolean): void {
    // Retrieve stored data
    const data = this.getStoredData();

    // Check if the component name exists in the stored data and if it has a 'body' property
    if (data[componentName]) {
      // If 'body' property exists, delete it
      delete data[componentName];
    }

    // If deleteID flag is true, delete the entire component entry
    if (deleteID) {
      delete data[componentName];
    }

    // Update the stored data after modifications
    this.updateStoredData(data);
  }

  /**
   * Navigates to a specified route while managing data related to the destination component.
   *
   * @param componentName The name of the component to associate the data with.
   * @param body The data body to be stored.
   * @param route The route to navigate to.
   * @param id The identifier associated with the data.
   */
  navigate(componentName: string, body: any, route: string, id: number | string) {
    // Remove any existing data associated with the component
    this.removeData(componentName, false);

    // Add new data associated with the component
    // In this case, body and id are stored together
    this.addData(componentName, { body, id });

    // Navigate to the specified route, prefixed with 'adminRoot' if provided
    this.router.navigate([`${this.adminRoot}${route}`]);
  }

  /**
   * Function to clear data stored in sessionStorage.
   * Removes the item associated with the specified storage key.
   */
  clearData(): void {
    sessionStorage.removeItem(this.storageKey); // Remove item from sessionStorage
  }

  /**
   * Checks if the stored data object is empty or if a specific component within the data is empty.
   * @param {string} componentName - The name of the component to check within the stored data.
   * @returns {boolean} - Returns true if the stored data object is empty or if the specified component is empty, otherwise returns false.
   */
  isEmptyObject(componentName: string): boolean {
    // Retrieve stored data
    const data = this.getStoredData();

    // Check if data exists and is an object with no properties
    if (data && typeof data === 'object' && Object.keys(data).length === 0) {
      return true; // If empty, return true
    } else {
      // If data is not empty, check if the specified component exists and if its body is empty
      if (data[componentName] && data[componentName]['body']) {
        return false; // If component body exists, return false
      } else {
        return true; // If component body is empty or component does not exist, return true
      }
    }
  }
  isEmptyComponent(componentName: string): boolean {
    // Retrieve stored data
    const data = this.getStoredData();

    // Check if data exists and is an object with no properties
    if (data && typeof data === 'object' && Object.keys(data).length === 0) {
      return true; // If empty, return true
    } else {
      // If data is not empty, check if the specified component exists and if its body is empty
      if (data[componentName]) {
        return false; // If component body exists, return false
      } else {
        return true; // If component body is empty or component does not exist, return true
      }
    }
  }

  /**
   * Encrypts data using AES encryption algorithm.
   *
   * @param data The data to be encrypted. It can be of any type.
   * @param key The encryption key used to encrypt the data. It must be a string.
   * @returns The encrypted data as a string.
   */
  private encryption(data: any, key: string): string {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);

    // Encrypt the JSON string using AES encryption with the provided key
    const encryptedData = CryptoJS.AES.encrypt(jsonString, key).toString();

    return encryptedData;
  }

  /**
   * Decrypts the provided encrypted data using AES encryption algorithm with the given key.
   *
   * @param {string} encryptedData - The encrypted data to be decrypted.
   * @param {string} key - The key used for decryption.
   * @returns {any} - The decrypted data.
   */
  decryption(encryptedData: string, key: string): any {
    // Decrypt the data using AES decryption algorithm
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    // Convert the decrypted bytes to UTF-8 encoded string
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    // Parse the decrypted string into JSON format
    return JSON.parse(decryptedString);
  }
}
