import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CalendarComponent implements OnInit {
  event: any = [];

  calendarOptions: CalendarOptions = { plugins: [dayGridPlugin, interactionPlugin, bootstrapPlugin] };
  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}
  ngOnInit(): void {
    this.calendarOptions.initialView = 'dayGridMonth';
  }
}
