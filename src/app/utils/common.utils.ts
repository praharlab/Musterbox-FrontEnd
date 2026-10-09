import { environment } from 'src/environments/environment';

export class CommonUtils {
  static getDatesFromDateRange(fromDate: Date, toDate: Date) {
    const dates = [];
    for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
      const cloned = new Date(date.valueOf());
      dates.push(cloned);
    }
    return dates;
  }

  static getFormattedMonth(Month: number): Date {
    const monthString = Month.toString(); // Convert number to string
    const year = parseInt(monthString.substring(0, 4), 10); // Extract year
    const month = parseInt(monthString.substring(4, 6), 10) - 1; // Extract month (0-based index)

    return new Date(year, month, 1); // Return valid Date object
  }
  static selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element = 'selectedAllGroup';
      });
    };

    return allSelect(items);
  }

  static getYear(numberOfPreviousYears: number) {
    const yearArray = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < numberOfPreviousYears; i++) {
      const previousYears = currentYear - i;
      yearArray.push(previousYears);
    }
    return yearArray;
  }

  static sortDataByFieldName(tobeSortData, sortFieldName) {
    const data = tobeSortData.sort((a, b) => {
      const dateA = new Date(a[sortFieldName]).getTime();
      const dateB = new Date(b[sortFieldName]).getTime();
      return dateA - dateB; // Ascending order
    });

    return data;
  }

  static validateCompanyLogo(companyLogo: string) {
    const img = new Image();
    let imageShow = false;
    img.src = environment.apiUrl + 'uploads/company/logo/' + companyLogo;
    if (img.complete) {
      imageShow = true;
    } else {
      img.onload = () => {
        imageShow = true;
      };

      img.onerror = () => {
        imageShow = false;
      };
    }

    return imageShow;
  }

  static padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  static formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        CommonUtils.padTo2Digits(date.getMonth() + 1),
        CommonUtils.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        CommonUtils.padTo2Digits(date.getHours()),
        CommonUtils.padTo2Digits(date.getMinutes()),
        CommonUtils.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  static getDateBeforeNDays(n: number): string {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD'
  }

  static getDaysBefore(dateStr: string): number {
    const currentDate = new Date(); // Today
    const givenDate = new Date(dateStr); // The given date (in 'YYYY-MM-DD' format)

    // Calculate difference in milliseconds
    const diffInMs = currentDate.getTime() - givenDate.getTime();

    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  }
   static calculateDateDifferenceInDays(dateStr1, dateStr2) {
    let timeDifferenceInMilliseconds = dateStr1 - dateStr2;
    let differenceInDays = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
    differenceInDays += 1;
    return differenceInDays + 1;
  }
}
