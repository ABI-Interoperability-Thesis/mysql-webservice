const calculateAge = (birth_date) => {
    const year = parseInt(birth_date.substring(0, 4));
    const month = parseInt(birth_date.substring(4, 6));
    const day = parseInt(birth_date.substring(6, 8));
    const dateOfBirth = new Date(year, month - 1, day); // Note: month is 0-indexed in JavaScript

    const now = new Date(); // get current date
    const ageInMs = now.getTime() - dateOfBirth.getTime(); // get age difference in milliseconds
    const ageInYears = ageInMs / 1000 / 60 / 60 / 24 / 365.25; // convert age difference to years (taking leap years into account)

    const age = Math.floor(ageInYears); // get age rounded down to nearest year

    return age
}

const calculateSecondsDays = (days) => {
    const secondsPerDay = 24 * 60 * 60; // number of seconds in a day (24 hours * 60 minutes * 60 seconds)

    const totalSeconds = days * secondsPerDay; // calculate total seconds

    return totalSeconds
}

const CalculateDateSeconds = (date) => {
    const dateRegex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.?(\d+)?([+-]\d{4})?$/;
    const matches = date.match(dateRegex);

    if (matches) {
        const [, year, month, day, hour, minute, second, millisecond, timezone] = matches;
        const date = new Date();

        date.setFullYear(parseInt(year));
        date.setMonth(parseInt(month) - 1);
        date.setDate(parseInt(day));
        date.setHours(parseInt(hour));
        date.setMinutes(parseInt(minute));
        date.setSeconds(parseInt(second));
        date.setMilliseconds(millisecond ? parseInt(millisecond) : 0);

        if (timezone) {
            const offset = parseInt(timezone.substring(0, 3)) * 60 + parseInt(timezone.substring(3));
            const sign = timezone.charAt(0) === '-' ? -1 : 1;
            date.setMinutes(date.getMinutes() - sign * offset);
        }

        const timeInSeconds = (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
        return timeInSeconds;
    }

    return null; // Invalid date format
}


module.exports = {
    calculateAge: calculateAge,
    calculateSecondsDays: calculateSecondsDays,
    CalculateDateSeconds: CalculateDateSeconds
}