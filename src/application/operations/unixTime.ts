export default function parseUnixTimeToDate(unixtime: number): Date {
    return new Date(unixtime * 1000);
}
