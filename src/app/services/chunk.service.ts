import { Injectable } from '@angular/core';
import { Router, NavigationError } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChunkService {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationError) {
        if (this.isChunkLoadError(event.error)) {
          window.location.reload();
        }
      }
    });
  }

  private isChunkLoadError(error: any): boolean {
    return error && error.name === 'ChunkLoadError';
  }
}
