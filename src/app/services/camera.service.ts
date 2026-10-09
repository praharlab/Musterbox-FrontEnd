import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  async hasCamera(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === 'videoinput');
      return hasCamera;
    } catch (error) {
      console.error('Error checking camera:', error);
      return false;
    }
  }

  async getCameraStream(): Promise<MediaStream | null> {
    try {
      const constraints: MediaStreamConstraints = {
        video: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return null;
    }
  }
}


