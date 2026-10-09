import { BrowserModule, REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { LayoutContainersModule } from './containers/layout/layout.containers.module';
import { SessionTimeOutComponent } from './session-time-out/session-time-out.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CompanyStructureComponent } from './views/app/myteam/company-structure/company-structure.component';
import { DocumentsUploadComponent } from './documents-upload/documents-upload.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QRCodeComponent } from 'angularx-qrcode';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPrintModule } from 'ngx-print';
import { QuillModule } from 'ngx-quill';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ComponentsChartModule } from './components/charts/components.charts.module';
import { ComponentsStateButtonModule } from './components/state-button/components.state-button.module';
import { PagesContainersModule } from './containers/pages/pages.containers.module';
import { SharedModule } from './shared/shared.module';
import { PreboardingsRoutingModule } from './views/app/preboardings/preboardings.routing';

@NgModule({ declarations: [
        AppComponent,
        SessionTimeOutComponent,
        CompanyStructureComponent,
        DocumentsUploadComponent
    ],
    bootstrap: [AppComponent],
    exports: [CompanyStructureComponent], imports: [CommonModule,
        BrowserModule,
        ViewsModule,
        AppRoutingModule,
        FormsModule,
        LayoutContainersModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        ModalModule,
        SimpleNotificationsModule.forRoot(),
        AngularDualListBoxModule,
        NgMultiSelectDropDownModule.forRoot(),
        PreboardingsRoutingModule,
        ModalModule,
        FormsModule,
        SharedModule,
        LayoutContainersModule,
        NgxDatatableModule,
        PagesContainersModule,
        CollapseModule,
        PaginationModule,
        TabsModule,
        TooltipModule,
        NgSelectModule,
        SimpleNotificationsModule.forRoot(),
        QuillModule.forRoot(),
        NgxUiLoaderModule,
        NgxPrintModule,
        BsDatepickerModule,
        TimepickerModule,
        NgxMaterialTimepickerModule,
        ComponentsStateButtonModule,
        NgxSignaturePadModule,
        QRCodeComponent,
        PdfViewerModule,
        BnNgTreeModule,
        NgCircleProgressModule.forRoot(),
        NgxPrintModule,
        ComponentsChartModule], providers: [
        // Angular 17 changed this default to true (styles of destroyed components are removed).
        // Many screens were built relying on styles that stayed loaded from earlier pages, so keep
        // the pre-v17 behaviour; switching it on needs a visual pass over every module first.
        { provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: false },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ] })
export class AppModule { }
