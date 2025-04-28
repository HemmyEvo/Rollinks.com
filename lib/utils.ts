import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
    const date_obj = new Date(dateString); // direct parsing from ISO string

    const current_date = new Date();
    current_date.setHours(0, 0, 0, 0);
    const current_time = current_date.getTime();

    const provided_date = new Date(date_obj);
    provided_date.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (provided_date.getTime() === current_time) {
        return date_obj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    if (provided_date.getTime() === yesterday.getTime()) {
        return "Yesterday";
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[provided_date.getDay()] || `${provided_date.getMonth() + 1}/${provided_date.getDate()}/${provided_date.getFullYear()}`;
}

