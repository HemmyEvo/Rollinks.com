import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date_ms: number) {
    const date_obj = new Date(date_ms);

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

export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

export const getRelativeDateTime = (message: any, previousMessage: any) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const messageDate = new Date(message._creationTime);

    if (!previousMessage || !isSameDay(previousMessage._creationTime, message._creationTime)) {
        if (isSameDay(message._creationTime, today.getTime())) {
            return "Today";
        } else if (isSameDay(message._creationTime, yesterday.getTime())) {
            return "Yesterday";
        } else if (messageDate > lastWeek) {
            return messageDate.toLocaleDateString(undefined, { weekday: "long" });
        } else {
            return messageDate.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        }
    }
};

export function randomID(len: number) {
    const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    let result = "";
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Define getRelativeDateTime function
export const getRelativeDateTime = (message: any, previousMessage: any) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const lastWeek = new Date(today);
	lastWeek.setDate(lastWeek.getDate() - 7);

	const messageDate = new Date(message._creationTime);

	if (!previousMessage || !isSameDay(previousMessage._creationTime, messageDate.getTime())) {
		if (isSameDay(messageDate.getTime(), today.getTime())) {
			return "Today";
		} else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
			return "Yesterday";
		} else if (messageDate.getTime() > lastWeek.getTime()) {
			const options: Intl.DateTimeFormatOptions = {
				weekday: "long",
			};
			return messageDate.toLocaleDateString(undefined, options);
		} else {
			const options: Intl.DateTimeFormatOptions = {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			};
			return messageDate.toLocaleDateString(undefined, options);
		}
	}
};

export function randomID(len: number) {
	let result = "";
	if (result) return result;
	var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
		maxPos = chars.length,
		i;
	len = len || 5;
	for (i = 0; i < len; i++) {
		result += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return result;
}