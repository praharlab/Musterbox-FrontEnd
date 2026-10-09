import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Colors {
  public static getColors(): any {
    const rootStyle = getComputedStyle(document.body);
    return {
      themeColor1: rootStyle.getPropertyValue('--theme-color-1').trim(),
      themeColor2: rootStyle.getPropertyValue('--theme-color-2').trim(),
      themeColor3: rootStyle.getPropertyValue('--theme-color-3').trim(),
      themeColor4: rootStyle.getPropertyValue('--theme-color-4').trim(),
      themeColor5: rootStyle.getPropertyValue('--theme-color-5').trim(),
      themeColor6: rootStyle.getPropertyValue('--theme-color-6').trim(),
      themeColor1_10: rootStyle.getPropertyValue('--theme-color-1-10').trim(),
      themeColor2_10: rootStyle.getPropertyValue('--theme-color-2-10').trim(),
      themeColor3_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
      themeColor4_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
      themeColor5_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
      themeColor6_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
      primaryColor: rootStyle.getPropertyValue('--primary-color').trim(),
      foregroundColor: rootStyle.getPropertyValue('--foreground-color').trim(),
      separatorColor: rootStyle.getPropertyValue('--separator-color').trim(),

      Present: '#28a745',
      Absent: '#ff3200',
      Holiday: '#5ab0de',

      MissPunch: '#8104a0',

      EarlyGoing: '#ffe83d',
      LateCome: '#7b68ee',

      HalfDay: '#f78325',

      NotPunchCalendar: '#9f9f9f',
      Leave: '#fc8ca5',
      weekoff: '#3462f6',

      Punchin: '#28a745',
      Punchout: '#f78325',
      NotPunch: '#616163',

      Active: '#28a745',
      DeActive: '#ffe83d',
      Left: '#ff3200',

      Gross: '#28a745',
      Deduction: '#ff3200',
      Net: '#ffe83d',
      CTC: '#3462f6',
      PenaltyWithOutDeduction: '#ffe83d',
      PenaltyWithDeduction: '#7b68ee',

      MainTask: '#5ab0de',
      SubTask: '#3462f6',

      Accepted: '#28a745',
      Pending: '#ffe83d',
      Rejected: '#ff3200',
      Completed: '#3462f6',

      shiftName: '#3d8f7e'
    };
  }
}
