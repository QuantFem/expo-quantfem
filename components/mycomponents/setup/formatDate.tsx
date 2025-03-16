import i18n from "@/components/mycomponents/setup/localization/localization";

interface LocalFormatterProps {
  date?: Date | null;
  includeTime?: boolean;
  timeFormat?: '12h' | '24h';
  timeOnly?: boolean; // New option for time-only formatting
  format?: 'date' | 'time' | 'datetime'; // Add this line
}

const LocalFormatter = ({ date, includeTime = false, timeFormat = '12h', timeOnly = false }: LocalFormatterProps): string => {
  if (!date) {
    return i18n.t("TRACKER.NO_ENTRIES");
  }

  // Function to format time
  const formatTime = () => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    let ampm = '';

    if (timeFormat === '12h') {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  };

  // If timeOnly is true, return only the formatted time
  if (timeOnly) {
    return formatTime();
  }

  // Extract localized months and weekdays
  const localizedMonths = i18n.t("CALENDAR.MONTH_NAMES", { returnObjects: true }) as string[];
  const localizedWeekDays = i18n.t("CALENDAR.WEEK_DAYS", { returnObjects: true }) as string[];

  // Format the date using localized names
  let formattedDate = `${localizedWeekDays[date.getDay()]}, ${date.getDate()} ${
    localizedMonths[date.getMonth()]
  } ${date.getFullYear()}`;

  // Add time if requested
  if (includeTime) {
    formattedDate += ` ${formatTime()}`;
  }

  return formattedDate;
};

export default LocalFormatter;
