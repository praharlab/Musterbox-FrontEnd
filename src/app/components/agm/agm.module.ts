/*
 * Local, AGM-compatible Google Maps components.
 *
 * Replaces @agm/core 1.0.0 and agm-direction 0.8.10 (MIT). Both are archived and ship only in
 * View Engine format, which cannot compile from Angular 16 on. Only the tags, inputs and outputs
 * used in this app are ported, with AGM's defaults, so the five map templates and their
 * components did not need to change. Everything talks to the Google Maps JavaScript API directly.
 *
 * Difference from agm-direction: a route is requested once per change. agm-direction requested
 * it twice on first render (from both ngOnChanges and ngOnInit), emitting onResponse twice.
 */
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  ModuleWithProviders,
  NgModule,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

export interface LazyMapsAPILoaderConfigLiteral {
  apiKey?: string;
  apiVersion?: string;
  libraries?: string[];
  language?: string;
  region?: string;
}

export const LAZY_MAPS_API_CONFIG = new InjectionToken<LazyMapsAPILoaderConfigLiteral>('angular-google-maps LAZY_MAPS_API_CONFIG');

const SCRIPT_ID = 'agmGoogleMapsApiScript';
const CALLBACK_NAME = 'agmLazyMapsAPILoader';
let scriptLoading: Promise<void> | null = null;

/** Loads the Google Maps script once, the same way AGM's LazyMapsAPILoader did. */
export function loadGoogleMapsApi(config: LazyMapsAPILoaderConfigLiteral | null): Promise<void> {
  const w = window as any;
  if (w.google && w.google.maps) {
    return Promise.resolve();
  }
  if (scriptLoading) {
    return scriptLoading;
  }
  scriptLoading = new Promise<void>((resolve, reject) => {
    w[CALLBACK_NAME] = () => resolve();
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      const params: Record<string, string> = { v: (config && config.apiVersion) || 'quarterly', callback: CALLBACK_NAME };
      if (config?.apiKey) params.key = config.apiKey;
      if (config?.libraries?.length) params.libraries = config.libraries.join(',');
      if (config?.language) params.language = config.language;
      if (config?.region) params.region = config.region;
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.id = SCRIPT_ID;
      script.src = 'https://maps.googleapis.com/maps/api/js?' + new URLSearchParams(params).toString();
      document.body.appendChild(script);
    }
    script.onerror = (error) => {
      scriptLoading = null;
      reject(error);
    };
  });
  return scriptLoading;
}

// ---------------------------------------------------------------------------------------------
// <agm-map>
// ---------------------------------------------------------------------------------------------

@Component({
    selector: 'agm-map',
    host: { '[class.sebm-google-map-container]': 'true' },
    template: `
    <div class="agm-map-container-inner sebm-google-map-container-inner"></div>
    <div class="agm-map-content">
      <ng-content></ng-content>
    </div>
  `,
    styles: [
        `
      .agm-map-container-inner {
        width: inherit;
        height: inherit;
      }
      .agm-map-content {
        display: none;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AgmMap implements OnInit, OnChanges, OnDestroy {
  @Input() latitude = 0;
  @Input() longitude = 0;
  @Input() zoom = 8;
  @Input() fullscreenControl = false;
  @Input() zoomControl: boolean;
  @Input() streetViewControl: boolean;
  @Input() mapTypeControl = false;
  @Input() scaleControl = false;
  @Input() disableDefaultUI = false;
  @Input() scrollwheel = true;
  @Input() gestureHandling = 'auto';
  /** Not an AGM map option (it was silently ignored there); accepted so existing templates compile. */
  @Input() geodesic: boolean;

  @Output() mapReady = new EventEmitter<google.maps.Map>();

  private map: google.maps.Map | null = null;
  private resolveMap: (map: google.maps.Map) => void;
  private readonly mapPromise = new Promise<google.maps.Map>((resolve) => (this.resolveMap = resolve));

  constructor(
    private elem: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Optional() @Inject(LAZY_MAPS_API_CONFIG) private config: LazyMapsAPILoaderConfigLiteral | null,
  ) {}

  ngOnInit(): void {
    const container = this.elem.nativeElement.querySelector('.agm-map-container-inner') as HTMLElement;
    loadGoogleMapsApi(this.config).then(() => {
      this.map = this.zone.runOutsideAngular(
        () =>
          new google.maps.Map(container, {
            center: { lat: Number(this.latitude) || 0, lng: Number(this.longitude) || 0 },
            zoom: this.zoom,
            disableDefaultUI: this.disableDefaultUI,
            scrollwheel: this.scrollwheel,
            zoomControl: this.zoomControl,
            streetViewControl: this.streetViewControl,
            scaleControl: this.scaleControl,
            mapTypeControl: this.mapTypeControl,
            panControl: false,
            rotateControl: false,
            fullscreenControl: this.fullscreenControl,
            mapTypeId: 'roadmap',
            clickableIcons: true,
            gestureHandling: this.gestureHandling,
            tilt: 0,
          } as google.maps.MapOptions),
      );
      this.resolveMap(this.map);
      this.mapReady.emit(this.map);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      return;
    }
    const options: google.maps.MapOptions = {};
    ['zoom', 'fullscreenControl', 'zoomControl', 'streetViewControl', 'mapTypeControl', 'scaleControl', 'disableDefaultUI', 'scrollwheel', 'gestureHandling'].forEach(
      (k) => {
        if (changes[k]) {
          options[k] = changes[k].currentValue;
        }
      },
    );
    if (Object.keys(options).length) {
      this.zone.runOutsideAngular(() => this.map.setOptions(options));
    }
    if ((changes.latitude || changes.longitude) && typeof this.latitude === 'number' && typeof this.longitude === 'number') {
      this.zone.runOutsideAngular(() => this.map.setCenter({ lat: this.latitude, lng: this.longitude }));
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
    }
  }

  getNativeMap(): Promise<google.maps.Map> {
    return this.mapPromise;
  }
}

// ---------------------------------------------------------------------------------------------
// <agm-info-window>
// ---------------------------------------------------------------------------------------------

@Component({
    selector: 'agm-info-window',
    template: `<div class="agm-info-window-content"><ng-content></ng-content></div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AgmInfoWindow implements OnInit, OnChanges, OnDestroy {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() disableAutoPan: boolean;
  @Input() zIndex: number;
  @Input() maxWidth: number;
  @Input() isOpen = false;
  @Output() infoWindowClose = new EventEmitter<void>();

  /** Set by the parent <agm-marker>. */
  hostMarker: AgmMarker | null = null;

  private window: google.maps.InfoWindow | null = null;
  private ready: Promise<google.maps.InfoWindow>;

  constructor(private map: AgmMap, private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnInit(): void {
    const content = this.el.nativeElement.querySelector('.agm-info-window-content') as HTMLElement;
    this.ready = this.map.getNativeMap().then(() => {
      const options: google.maps.InfoWindowOptions = { content, maxWidth: this.maxWidth, zIndex: this.zIndex, disableAutoPan: this.disableAutoPan };
      if (typeof this.latitude === 'number' && typeof this.longitude === 'number') {
        options.position = { lat: this.latitude, lng: this.longitude };
      }
      this.window = this.zone.runOutsideAngular(() => new google.maps.InfoWindow(options));
      this.window.addListener('closeclick', () =>
        this.zone.run(() => {
          this.isOpen = false;
          this.infoWindowClose.emit();
        }),
      );
      return this.window;
    });
    if (this.isOpen) {
      this.open();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.window) {
      return;
    }
    const options: google.maps.InfoWindowOptions = {};
    if (changes.disableAutoPan) options.disableAutoPan = this.disableAutoPan;
    if (changes.maxWidth) options.maxWidth = this.maxWidth;
    if (Object.keys(options).length) this.window.setOptions(options);
    if (changes.zIndex) this.window.setZIndex(this.zIndex);
    if ((changes.latitude || changes.longitude) && typeof this.latitude === 'number' && typeof this.longitude === 'number') {
      this.window.setPosition({ lat: this.latitude, lng: this.longitude });
    }
    if (changes.isOpen) {
      this.isOpen ? this.open() : this.close();
    }
  }

  open(): Promise<void> {
    return Promise.all([this.ready, this.map.getNativeMap(), this.hostMarker ? this.hostMarker.getNativeMarker() : Promise.resolve(null)]).then(
      ([w, map, marker]) => this.zone.runOutsideAngular(() => (marker ? w.open(map, marker) : w.open(map))),
    );
  }

  close(): Promise<void> {
    return this.ready.then((w) => {
      w.close();
      this.infoWindowClose.emit();
    });
  }

  ngOnDestroy(): void {
    this.window?.close();
  }
}

// ---------------------------------------------------------------------------------------------
// <agm-marker>
// ---------------------------------------------------------------------------------------------

@Directive({
    selector: 'agm-marker',
    standalone: false
})
export class AgmMarker implements OnChanges, AfterContentInit, OnDestroy {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() iconUrl: string | google.maps.Icon | google.maps.Symbol;
  @Input() animation: keyof typeof google.maps.Animation | null;
  @Input() title: string;
  @Input() label: string | google.maps.MarkerLabel;
  @Input() draggable = false;
  @Input() opacity = 1;
  @Input() visible = true;
  @Input() zIndex = 1;
  @Input() clickable = true;
  @Input() openInfoWindow = true;
  @Output() markerClick = new EventEmitter<AgmMarker>();

  @ContentChildren(AgmInfoWindow) infoWindow: QueryList<AgmInfoWindow>;

  private marker: google.maps.Marker | null = null;
  private resolveMarker: (m: google.maps.Marker) => void;
  private readonly markerPromise = new Promise<google.maps.Marker>((resolve) => (this.resolveMarker = resolve));
  private infoWindowSub: Subscription;
  private created = false;

  constructor(private map: AgmMap, private zone: NgZone) {}

  ngAfterContentInit(): void {
    this.assignHost();
    this.infoWindowSub = this.infoWindow.changes.subscribe(() => this.assignHost());
  }

  private assignHost(): void {
    this.infoWindow.forEach((w) => (w.hostMarker = this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.latitude === 'string') this.latitude = Number(this.latitude);
    if (typeof this.longitude === 'string') this.longitude = Number(this.longitude);
    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      return;
    }
    if (!this.created) {
      this.created = true;
      this.map.getNativeMap().then((map) => {
        this.marker = this.zone.runOutsideAngular(
          () =>
            new google.maps.Marker({
              map,
              position: { lat: this.latitude, lng: this.longitude },
              label: this.label,
              draggable: this.draggable,
              icon: this.iconUrl,
              opacity: this.opacity,
              visible: this.visible,
              zIndex: this.zIndex,
              title: this.title,
              clickable: this.clickable,
              animation: this.convertAnimation(this.animation),
            }),
        );
        this.marker.addListener('click', () =>
          this.zone.run(() => {
            if (this.openInfoWindow) {
              this.infoWindow.forEach((w) => w.open());
            }
            this.markerClick.emit(this);
          }),
        );
        this.resolveMarker(this.marker);
      });
      return;
    }
    this.markerPromise.then((m) =>
      this.zone.runOutsideAngular(() => {
        if (changes.latitude || changes.longitude) m.setPosition({ lat: this.latitude, lng: this.longitude });
        if (changes.iconUrl) m.setIcon(this.iconUrl);
        if (changes.animation) m.setAnimation(this.convertAnimation(this.animation));
        if (changes.title) m.setTitle(this.title);
        if (changes.label) m.setLabel(this.label);
        if (changes.draggable) m.setDraggable(this.draggable);
        if (changes.opacity) m.setOpacity(this.opacity);
        if (changes.visible) m.setVisible(this.visible);
        if (changes.zIndex) m.setZIndex(this.zIndex);
        if (changes.clickable) m.setClickable(this.clickable);
      }),
    );
  }

  private convertAnimation(anim: string | null | undefined): google.maps.Animation | null | undefined {
    return anim === null ? null : google.maps.Animation[anim as keyof typeof google.maps.Animation];
  }

  getNativeMarker(): Promise<google.maps.Marker> {
    return this.markerPromise;
  }

  ngOnDestroy(): void {
    this.infoWindowSub?.unsubscribe();
    if (this.marker) {
      google.maps.event.clearInstanceListeners(this.marker);
      this.marker.setMap(null);
    }
  }
}

// ---------------------------------------------------------------------------------------------
// <agm-polyline>, <agm-polyline-point>, <agm-icon-sequence>
// ---------------------------------------------------------------------------------------------

@Directive({
    selector: 'agm-polyline-point',
    standalone: false
})
export class AgmPolylinePoint implements OnChanges {
  @Input() latitude: number;
  @Input() longitude: number;
  readonly positionChanged = new Subject<void>();

  ngOnChanges(): void {
    this.positionChanged.next();
  }
}

@Directive({
    selector: 'agm-polyline agm-icon-sequence',
    standalone: false
})
export class AgmPolylineIcon {
  @Input() fixedRotation: boolean;
  @Input() offset: string;
  @Input() repeat: string;
  @Input() anchorX: number;
  @Input() anchorY: number;
  @Input() fillColor: string;
  @Input() fillOpacity: number;
  @Input() path: 'CIRCLE' | 'BACKWARD_CLOSED_ARROW' | 'BACKWARD_OPEN_ARROW' | 'FORWARD_CLOSED_ARROW' | 'FORWARD_OPEN_ARROW' | string;
  @Input() rotation: number;
  @Input() scale: number;
  @Input() strokeColor: string;
  @Input() strokeOpacity: number;
  @Input() strokeWeight: number;
}

@Directive({
    selector: 'agm-polyline',
    standalone: false
})
export class AgmPolyline implements OnChanges, AfterContentInit, OnDestroy {
  @Input() clickable = true;
  @Input() editable = false;
  @Input() geodesic = false;
  @Input() strokeColor: string;
  @Input() strokeOpacity: number;
  @Input() strokeWeight: number;
  @Input() visible = true;
  @Input() zIndex: number;

  @ContentChildren(AgmPolylinePoint) points: QueryList<AgmPolylinePoint>;
  @ContentChildren(AgmPolylineIcon) iconSequences: QueryList<AgmPolylineIcon>;

  private line: google.maps.Polyline | null = null;
  private subs: Subscription[] = [];
  private pointSubs: Subscription[] = [];

  constructor(private map: AgmMap, private zone: NgZone) {}

  ngAfterContentInit(): void {
    this.map.getNativeMap().then((map) => {
      this.line = this.zone.runOutsideAngular(
        () =>
          new google.maps.Polyline({
            map,
            clickable: this.clickable,
            draggable: false,
            editable: this.editable,
            geodesic: this.geodesic,
            strokeColor: this.strokeColor,
            strokeOpacity: this.strokeOpacity,
            strokeWeight: this.strokeWeight,
            visible: this.visible,
            zIndex: this.zIndex,
            path: this.path(),
            icons: this.icons(),
          }),
      );
    });
    this.watchPoints();
    this.subs.push(this.points.changes.subscribe(() => this.watchPoints()));
    this.subs.push(this.iconSequences.changes.subscribe(() => this.line?.setOptions({ icons: this.icons() })));
  }

  private watchPoints(): void {
    this.pointSubs.forEach((s) => s.unsubscribe());
    this.pointSubs = this.points.map((p) => p.positionChanged.subscribe(() => this.updatePath()));
    this.updatePath();
  }

  private updatePath(): void {
    if (this.line) {
      this.zone.runOutsideAngular(() => this.line.setPath(this.path()));
    }
  }

  private path(): google.maps.LatLngLiteral[] {
    return this.points ? this.points.map((p) => ({ lat: p.latitude, lng: p.longitude })) : [];
  }

  private icons(): google.maps.IconSequence[] {
    if (!this.iconSequences) {
      return [];
    }
    return this.iconSequences.map((i) => {
      const symbolPath = google.maps.SymbolPath[i.path as keyof typeof google.maps.SymbolPath];
      const icon: any = {
        anchor: new google.maps.Point(i.anchorX, i.anchorY),
        fillColor: i.fillColor,
        fillOpacity: i.fillOpacity,
        path: typeof symbolPath === 'number' ? symbolPath : i.path,
        rotation: i.rotation,
        scale: i.scale,
        strokeColor: i.strokeColor,
        strokeOpacity: i.strokeOpacity,
        strokeWeight: i.strokeWeight,
      };
      const seq: any = { fixedRotation: i.fixedRotation, offset: i.offset, repeat: i.repeat, icon };
      Object.keys(seq).forEach((k) => seq[k] === undefined && delete seq[k]);
      // same as AGM: drop the anchor unless both anchorX and anchorY are given
      if (i.anchorX === undefined || i.anchorY === undefined) {
        delete icon.anchor;
      }
      return seq;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.line) {
      return;
    }
    const options: google.maps.PolylineOptions = {};
    ['clickable', 'editable', 'geodesic', 'strokeColor', 'strokeOpacity', 'strokeWeight', 'visible', 'zIndex'].forEach((k) => {
      if (changes[k]) options[k] = changes[k].currentValue;
    });
    this.line.setOptions(options);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.pointSubs.forEach((s) => s.unsubscribe());
    this.line?.setMap(null);
  }
}

// ---------------------------------------------------------------------------------------------
// <agm-direction>
// ---------------------------------------------------------------------------------------------

@Directive({
    selector: 'agm-direction',
    standalone: false
})
export class AgmDirection implements OnChanges, OnDestroy {
  @Input() origin: string | google.maps.Place | google.maps.LatLng | google.maps.LatLngLiteral;
  @Input() destination: string | google.maps.Place | google.maps.LatLng | google.maps.LatLngLiteral;
  @Input() travelMode: google.maps.TravelMode;
  @Input() transitOptions: google.maps.TransitOptions;
  @Input() drivingOptions: google.maps.DrivingOptions;
  @Input() waypoints: google.maps.DirectionsWaypoint[] = [];
  @Input() optimizeWaypoints = true;
  @Input() provideRouteAlternatives = false;
  @Input() avoidHighways = false;
  @Input() avoidTolls = false;
  @Input() avoidFerries = false;
  @Input() unitSystem: google.maps.UnitSystem;
  @Input() renderOptions: google.maps.DirectionsRendererOptions;
  @Input() panel: HTMLElement;
  @Input() markerOptions: { origin?: any; destination?: any; waypoints?: any };
  @Input() infoWindow: google.maps.InfoWindow;
  @Input() visible = true;
  @Input() renderRoute: google.maps.DirectionsResult;

  @Output() onChange = new EventEmitter<google.maps.DirectionsResult>();
  @Output() onResponse = new EventEmitter<google.maps.DirectionsResult>();
  @Output() sendInfoWindow = new EventEmitter<google.maps.InfoWindow>();
  @Output() status = new EventEmitter<google.maps.DirectionsStatus | string>();

  private directionsRenderer: google.maps.DirectionsRenderer;
  private directionsService: google.maps.DirectionsService;
  private originMarker: google.maps.Marker;
  private destinationMarker: google.maps.Marker;
  private waypointsMarker: google.maps.Marker[] = [];

  constructor(private map: AgmMap, private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.visible) {
      this.removeMarkers();
      this.removeDirections();
      return;
    }
    if (changes.renderOptions && !changes.renderOptions.firstChange) {
      this.removeMarkers();
      this.removeDirections();
    }
    this.directionDraw();
  }

  ngOnDestroy(): void {
    this.destroyMarkers();
    this.removeDirections();
  }

  private directionDraw(): void {
    this.map.getNativeMap().then((map) =>
      this.zone.runOutsideAngular(() => {
        if (!this.directionsRenderer) {
          this.directionsRenderer = new google.maps.DirectionsRenderer(this.renderOptions);
          this.directionsRenderer.setMap(map);
          this.directionsRenderer.addListener('directions_changed', () =>
            this.zone.run(() => this.onChange.emit(this.directionsRenderer.getDirections())),
          );
        }
        if (!this.directionsService) {
          this.directionsService = new google.maps.DirectionsService();
        }
        this.directionsRenderer.setPanel(this.panel === undefined ? null : this.panel);
        if (this.renderRoute) {
          this.directionsRenderer.setDirections(this.renderRoute);
          this.renderRoute = undefined;
          return;
        }
        this.directionsService.route(
          {
            origin: this.origin,
            destination: this.destination,
            travelMode: this.travelMode || google.maps.TravelMode.DRIVING,
            transitOptions: this.transitOptions,
            drivingOptions: this.drivingOptions,
            waypoints: this.waypoints,
            optimizeWaypoints: this.optimizeWaypoints,
            provideRouteAlternatives: this.provideRouteAlternatives,
            avoidHighways: this.avoidHighways,
            avoidTolls: this.avoidTolls,
            avoidFerries: this.avoidFerries,
            unitSystem: this.unitSystem,
          },
          (response, status) =>
            this.zone.run(() => {
              this.onResponse.emit(response);
              this.status.emit(status);
              if (status === google.maps.DirectionsStatus.OK) {
                this.zone.runOutsideAngular(() => {
                  this.directionsRenderer?.setDirections(response);
                  this.drawMarkers(map, response);
                });
              } else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                console.warn('The webpage has sent too many requests within the allowed time period.');
              }
            }),
        );
      }),
    );
  }

  private drawMarkers(map: google.maps.Map, response: google.maps.DirectionsResult): void {
    if (this.markerOptions === undefined) {
      return;
    }
    this.destroyMarkers();
    const route = response.routes[0].legs[0];
    try {
      if (this.markerOptions.origin !== undefined) {
        this.markerOptions.origin.map = map;
        this.markerOptions.origin.position = route.start_location;
        this.originMarker = this.setMarker(map, this.markerOptions.origin, route.start_address);
      }
      if (this.markerOptions.destination !== undefined) {
        this.markerOptions.destination.map = map;
        this.markerOptions.destination.position = route.end_location;
        this.destinationMarker = this.setMarker(map, this.markerOptions.destination, route.end_address);
      }
      if (this.markerOptions.waypoints !== undefined) {
        this.waypoints.forEach((_, index) => {
          const opts = Array.isArray(this.markerOptions.waypoints) ? this.markerOptions.waypoints[index] : this.markerOptions.waypoints;
          opts.map = map;
          opts.position = route.via_waypoints[index];
          this.waypointsMarker.push(this.setMarker(map, opts, route.via_waypoints[index]));
        });
      }
    } catch (err) {
      console.error('MarkerOptions error.', err);
    }
  }

  private setMarker(map: google.maps.Map, markerOpts: any, content: any): google.maps.Marker {
    if (this.infoWindow === undefined) {
      this.infoWindow = new google.maps.InfoWindow();
      this.zone.run(() => this.sendInfoWindow.emit(this.infoWindow));
    }
    const marker = new google.maps.Marker(markerOpts);
    if (marker.getClickable()) {
      marker.addListener('click', () => {
        this.infoWindow.setContent(markerOpts.infoWindow === undefined ? content : markerOpts.infoWindow);
        this.infoWindow.open(map, marker);
      });
    }
    return marker;
  }

  private removeMarkers(): void {
    this.originMarker?.setMap(null);
    this.destinationMarker?.setMap(null);
    this.waypointsMarker.forEach((w) => w?.setMap(null));
  }

  private destroyMarkers(): void {
    [this.originMarker, this.destinationMarker, ...this.waypointsMarker].forEach((m) => m && google.maps.event.clearInstanceListeners(m));
    this.removeMarkers();
    this.waypointsMarker = [];
  }

  private removeDirections(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setPanel(null);
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = undefined;
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Modules (same names as @agm/core and agm-direction)
// ---------------------------------------------------------------------------------------------

@NgModule({
  declarations: [AgmMap, AgmMarker, AgmInfoWindow, AgmPolyline, AgmPolylinePoint, AgmPolylineIcon],
  exports: [AgmMap, AgmMarker, AgmInfoWindow, AgmPolyline, AgmPolylinePoint, AgmPolylineIcon],
})
export class AgmCoreModule {
  static forRoot(config?: LazyMapsAPILoaderConfigLiteral): ModuleWithProviders<AgmCoreModule> {
    return { ngModule: AgmCoreModule, providers: [{ provide: LAZY_MAPS_API_CONFIG, useValue: config }] };
  }
}

@NgModule({
  declarations: [AgmDirection],
  exports: [AgmDirection],
})
export class AgmDirectionModule {
  static forRoot(): ModuleWithProviders<AgmDirectionModule> {
    return { ngModule: AgmDirectionModule };
  }

  static forChild(): ModuleWithProviders<AgmDirectionModule> {
    return { ngModule: AgmDirectionModule };
  }
}
