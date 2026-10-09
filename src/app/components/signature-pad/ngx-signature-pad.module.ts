/*
 * Local port of @o.krucheniuk/ngx-signature-pad 0.0.7 (MIT). The package was built for Angular 11
 * in View Engine format and cannot compile from Angular 16 on. It is a thin wrapper around the
 * framework-free `signature_pad` library; selector, template, inputs and methods are unchanged.
 */
import { AfterViewInit, Component, ElementRef, Input, NgModule, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import SignaturePad, { Options } from 'signature_pad';

export interface SignaturePadOptions extends Options {
  test?: string;
}

export interface IBasicPoint {
  x: number;
  y: number;
  time: number;
}

export interface IPointGroup {
  color: string;
  points: IBasicPoint[];
}

@Component({
    selector: 'ngx-signature-pad',
    template: `
    <div #signaturePadContainer>
      <canvas #signaturePad></canvas>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NgxSignaturePadComponent implements OnChanges, AfterViewInit {
  @Input() config: SignaturePadOptions;

  @ViewChild('signaturePad', { static: false }) signaturePadElement: ElementRef<HTMLCanvasElement>;
  @ViewChild('signaturePadContainer', { static: false }) signaturePadContainerElement: ElementRef<HTMLDivElement>;

  private signaturePad: SignaturePad;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config && !changes.config.firstChange && this.signaturePad) {
      Object.keys(changes.config.currentValue).forEach((key) => {
        this.signaturePad[key] = changes.config.currentValue[key];
      });
    }
  }

  ngAfterViewInit(): void {
    this.setCanvasSize();
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, this.config);
  }

  setCanvasSize(): void {
    const { offsetWidth, offsetHeight } = this.signaturePadContainerElement.nativeElement;
    this.signaturePadElement.nativeElement.width = offsetWidth;
    this.signaturePadElement.nativeElement.height = offsetHeight;
  }

  clear(): void {
    this.signaturePad.clear();
  }

  fromDataURL(dataUrl: string, options?: { ratio?: number; width?: number; height?: number }, callback?: (error?: string | Event) => void): void {
    this.signaturePad.fromDataURL(dataUrl, options, callback);
  }

  toDataURL(type?: string, encoderOptions?: number): string {
    return this.signaturePad.toDataURL(type, encoderOptions);
  }

  on(): void {
    this.signaturePad.on();
  }

  off(): void {
    this.signaturePad.off();
  }

  isEmpty(): boolean {
    return this.signaturePad ? this.signaturePad.isEmpty() : true;
  }

  fromData(pointGroups: IPointGroup[]): void {
    this.signaturePad.fromData(pointGroups);
  }

  toData(): IPointGroup[] {
    return this.signaturePad.toData();
  }

  forceUpdate(): void {
    this.setCanvasSize();
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, this.config);
  }
}

@NgModule({
  declarations: [NgxSignaturePadComponent],
  exports: [NgxSignaturePadComponent],
})
export class NgxSignaturePadModule {}
