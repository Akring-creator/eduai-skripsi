import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date) {
  const currentDate = new Date().getTime();
  const diffTime = currentDate - date.getTime();
  const seconds = Math.floor(diffTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? 'Tahun lalu' : `${years} tahun lalu`;
  } else if (months > 0) {
    return months === 1 ? 'Bulan lalu' : `${months} bulan lalu`;
  } else if (days > 0) {
    return days === 1 ? 'Kemarin' : `${days} hari lalu`;
  } else if (hours > 0) {
    return hours === 1 ? '1 jam lalu' : `${hours} jam lalu`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 menit lalu' : `${minutes} menit lalu`;
  } else {
    return 'Baru saja';
  }
}
