import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  constructor(
    private http: HttpClient,
  ) { }

  getIPAddress(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>('https://api.ipify.org/?format=json');
  }
}
