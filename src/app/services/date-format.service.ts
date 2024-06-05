import { Injectable } from '@angular/core';
import { parse, addMinutes, addHours } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  parseAdobeDate(dateStr: string): Date | null {
    if (!dateStr || !dateStr.startsWith('D:')) return null;

    const datePart = dateStr.slice(2, 16); // Extract the main date part
    let date = parse(datePart, "yyyyMMddHHmmss", new Date());

    const timeZonePattern = /([+-])(\d{2})'(\d{2})'/;
    const parts = dateStr.match(timeZonePattern);
    if (parts) {
      const sign = parts[1];
      const hours = parseInt(parts[2]);
      const minutes = parseInt(parts[3]);
      const offset = (hours * 60 + minutes) * (sign === '+' ? -1 : 1);
      date = addMinutes(date, offset);
    }

    // Add JST offset (UTC+9)
    date = addHours(date, 9);
    return date;
  }

  formatDateToJapanTime(dateStr: string): string {
    const date = this.parseAdobeDate(dateStr);
    if (!date) return '';
    return formatInTimeZone(date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  }
}
