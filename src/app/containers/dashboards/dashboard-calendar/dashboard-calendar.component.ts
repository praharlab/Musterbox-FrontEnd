import { Component, ViewChild, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { Colors } from 'src/app/constants/colors.service';

@Component({
    selector: 'app-dashboard-calendar',
    templateUrl: './dashboard-calendar.component.html',
    styleUrls: ['./dashboard-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardCalendarComponent implements OnInit {
  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;
  calendarVisible = true;
  showloader: any = 'true';

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, bootstrapPlugin],

    headerToolbar: {
      left: 'today',
      center: 'title',
      right: 'prev,next',
    },
    themeSystem: 'bootstrap',
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 1,
    eventOverlap: false,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: this.eventsfunction.bind(this),
    eventOrder: 'priority',
    customButtons: {
      today: {
        text: 'Today',
        click: () => {
          this.goToToday();
        },
      },
      prev: {
        text: 'Prev',
        click: () => {
          this.goToPrev();
        },
      },
      next: {
        text: 'Next',
        click: () => {
          this.goToNext();
        },
      },
    },
  };

  currentEvents: any[];
  events: any | [];
  calendarData: any = [];
  CalendarStartDate: any;
  CalendarEndDate: any;
  startDate1: any;
  startMonth1: any;
  startYear1: any;
  endDate1: any;
  endMonth1: any;
  endYear1: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  goToToday() {
    const calendarApi = this.fullCalendar.getApi(); // Get FullCalendar API instance
    calendarApi.today(); // Call the next() method to go to the next view
    const view = calendarApi.view; // Get the current view
    const start = view.currentStart; // Get the start date of the view
    const end = view.currentEnd; // Get the end date of the view

    let currentDate = new Date(start);

    this.startMonth1 = currentDate.getMonth() + 1;
    this.startYear1 = currentDate.getFullYear();

    let nextMonthStartDate = new Date(currentDate);
    nextMonthStartDate.setMonth(currentDate.getMonth(), 2);
    nextMonthStartDate.setHours(0, 0, 0, 0);

    let nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(currentDate.getMonth() + 1, 0);
    nextMonthEndDate.setHours(23, 59, 59, 999);

    this.CalendarStartDate = nextMonthStartDate.toISOString().slice(0, 10);
    this.CalendarEndDate = nextMonthEndDate.toISOString().slice(0, 10);

    this.getCalenderData(this.CalendarStartDate, this.CalendarEndDate);
  }

  goToNext() {
    const calendarApi = this.fullCalendar.getApi(); // Get FullCalendar API instance
    calendarApi.next(); // Call the next() method to go to the next view
    const view = calendarApi.view; // Get the current view
    const start = view.currentStart; // Get the start date of the view
    const end = view.currentEnd; // Get the end date of the view

    // Parse the given date
    let currentDate = new Date(start);

    this.startMonth1 = currentDate.getMonth() + 1;
    this.startYear1 = currentDate.getFullYear();

    // Calculate the start date of the next month
    let nextMonthStartDate = new Date(currentDate);
    nextMonthStartDate.setMonth(currentDate.getMonth(), 2);
    nextMonthStartDate.setHours(0, 0, 0, 0);

    // Calculate the end date of the next month
    let nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(currentDate.getMonth() + 1, 0);
    nextMonthEndDate.setHours(23, 59, 59, 999);

    // Convert the start and end dates to the desired format
    this.CalendarStartDate = nextMonthStartDate.toISOString().slice(0, 10);
    this.CalendarEndDate = nextMonthEndDate.toISOString().slice(0, 10);

    this.getCalenderData(this.CalendarStartDate, this.CalendarEndDate);
  }

  goToPrev() {
    const calendarApi = this.fullCalendar.getApi(); // Get FullCalendar API instance
    calendarApi.prev(); // Call the prev() method to go to the previous view
    const view = calendarApi.view; // Get the current view
    const start = view.currentStart; // Get the start date of the view
    const end = view.currentEnd; // Get the end date of the view

    let currentDate = new Date(start);

    this.startMonth1 = currentDate.getMonth() + 1;
    this.startYear1 = currentDate.getFullYear();

    // Calculate the start date of the next month
    let nextMonthStartDate = new Date(currentDate);
    nextMonthStartDate.setMonth(currentDate.getMonth(), 2);
    nextMonthStartDate.setHours(0, 0, 0, 0);

    // Calculate the end date of the next month
    let nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(currentDate.getMonth() + 1, 0);
    nextMonthEndDate.setHours(23, 59, 59, 999);

    // Convert the start and end dates to the desired format
    this.CalendarStartDate = nextMonthStartDate.toISOString().slice(0, 10);
    this.CalendarEndDate = nextMonthEndDate.toISOString().slice(0, 10);

    this.getCalenderData(this.CalendarStartDate, this.CalendarEndDate);
  }

  handleDateSelect(selectInfo: DateSelectArg) { }

  handleEventClick(clickInfo: EventClickArg) { }

  eventsfunction() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    let startDate = new Date(year, Number(month), 2);
    let endDate = new Date(year, Number(month) + 1, 1);

    let startDateFormatted = startDate.toISOString().slice(0, 10);
    let endDateFormatted = endDate.toISOString().slice(0, 10);

    this.CalendarStartDate = startDateFormatted;
    this.CalendarEndDate = endDateFormatted;

    this.getCalenderData(this.CalendarStartDate, this.CalendarEndDate);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  getCalenderData(calendarStartDate: any, calendarEndDate: any) {
    let body = {
      userMasterID: localStorage.getItem('id'),
      calendarstartdate: calendarStartDate,
      calendarenddate: calendarEndDate,
    };
    this.showloader = 'true';
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.calendarData = res.data.reverse();

          for (let i = 0; i < this.calendarData.length; i++) {
            this.calendarData[i]['classNames'] =
              'w-sm-100 w-md-100 w-80 m-auto icon d-flex justify-content-center  justify-content-lg-around justify-content-xl-around   text-white align-items-center   font-weight-bold  lh-1 text-wrap text-center';

            if (this.calendarData[i].title === 'Absent') {
              this.calendarData[i]['color'] = Colors.getColors().Absent;
              this.calendarData[i]['priority'] = 1;
            } else if (this.calendarData[i].title === 'WeekOff') {
              this.calendarData[i]['color'] = Colors.getColors().weekoff;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Half Day') {
              this.calendarData[i]['color'] = Colors.getColors().HalfDay;
              this.calendarData[i]['priority'] = 1;
            } else if (this.calendarData[i].title === 'Present') {
              this.calendarData[i]['color'] = Colors.getColors().Present;
              this.calendarData[i]['priority'] = 1;
              this.calendarData[i].title = "P"
            } else if (this.calendarData[i].title === 'Holiday') {
              this.calendarData[i]['color'] = Colors.getColors().Holiday;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Miss Punch') {
              this.calendarData[i]['color'] = Colors.getColors().MissPunch;
              this.calendarData[i]['priority'] = 2;
            }else if (this.calendarData[i].title === 'Optional Holiday') {
              this.calendarData[i]['color'] = Colors.getColors().Holiday;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Leave') {
              this.calendarData[i]['color'] = Colors.getColors().Leave;
              this.calendarData[i]['priority'] = 3;
            } else if (this.calendarData[i].title === 'PL') {
              this.calendarData[i]['color'] = Colors.getColors().Leave;
              this.calendarData[i]['priority'] = 3;
            } else if (this.calendarData[i].isShift == true) {
              this.calendarData[i]['color'] = Colors.getColors().shiftName;
              this.calendarData[i]['priority'] = 4;
            } else if (this.calendarData[i].title.includes('Present')) {
              this.calendarData[i]['priority'] = 1;

              if (this.calendarData[i].penaltyDeduction || this.calendarData[i].goEarlyPanaltyDeduction) { this.calendarData[i]['color'] = Colors.getColors().PenaltyWithDeduction; this.calendarData[i].title = this.calendarData[i].title.replace("Present", "P"); }
              else if (this.calendarData[i].title.includes('LC') || this.calendarData[i].title.includes('EG')) { this.calendarData[i]['color'] = Colors.getColors().PenaltyWithOutDeduction; this.calendarData[i].title = this.calendarData[i].title.replace("Present", "P"); }
              else { this.calendarData[i]['color'] = Colors.getColors().Present; this.calendarData[i].title = this.calendarData[i].title.replace("Present", "P"); }

            } else {
              this.calendarData[i]['priority'] = 3;
              this.calendarData[i]['color'] = Colors.getColors().Leave;
            }


            // if (this.calendarData[i].title === 'Optional Holiday') this.calendarData[i].title = "Optional<br> Holiday";
          }

          this.calendarOptions.events = this.calendarData;
          this.showloader = 'false';
        }
      });
  }

  ngOnInit() {
    this.eventsfunction();
  }
}
