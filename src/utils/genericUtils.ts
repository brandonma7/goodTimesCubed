import { isEmpty, xorWith, isEqual } from 'lodash';
import { SolveData } from '../components/Timer';
import { Solve } from './cubingUtils';

// Turn the formatted time (from entry) into an integer in centi-seconds
export function unFormatTime(time = ''): number {
    time = time.split(':').join('').split('.').join('');
    if (isNaN(parseInt(time))) {
        return 0;
        // return time;
    }
    if (time.length <= 4) {
        return Math.abs(parseInt(time));
    }
    const centiseconds = parseInt(time.slice(time.length - 4));
    const minutes = parseInt(time.slice(0, time.length - 4));
    return Math.abs(minutes * 60 * 100 + centiseconds);
}

export function getFormattedTimeBySolve(solve?: Solve, showHours = false): string {
    if (!solve) {
        return '-';
    }
    const { time, isPlusTwo, isDNF } = solve;
    return getFormattedTime(time, isPlusTwo, isDNF, showHours);
}

export function getFormattedTime(time = 0, isPlusTwo = false, isDNF = false, showHours = false): string {
    // If solve is flagged as DNF, call it that instead of providing time
    if (isDNF) {
        return 'DNF';
    }
    // If time is negative, could be an error or an intentional request for a 'dash'
    if (time < 0) {
        return '-';
    }
    const hours = Math.trunc(time / 60 / 60 / 100);

    if (hours > 0 && !showHours) {
        return `1hr+`;
    }

    const minutes = Math.trunc((time - hours * 60 * 60 * 100) / 60 / 100);
    const seconds = Math.trunc((time - hours * 60 * 60 * 100 - minutes * 60 * 100) / 100);
    const centiseconds = Math.trunc(time - hours * 60 * 60 * 100 - minutes * 60 * 100 - seconds * 100);

    const plusSign = isPlusTwo ? '+' : '';

    const extraZero = centiseconds < 10 ? '0' : '';
    let formattedTime = `${seconds}.${extraZero}${centiseconds}${plusSign}`;

    if (minutes > 0 || hours > 0) {
        const extraZero = seconds < 10 ? '0' : '';
        formattedTime = `${minutes}:${extraZero}${formattedTime}`;
    }
    if (hours > 0) {
        const extraZero = minutes < 10 ? '0' : '';
        formattedTime = `${hours}:${extraZero}${formattedTime}`;
    }

    return formattedTime;
}

export function getRand(max: number) {
    return Math.floor(Math.random() * max);
}

export function classNames(...classes: string[]) {
    return classes
        .filter(Boolean)
        .filter((c) => c?.length)
        .join(' ');
}

export const areSessionsSame = (x: SolveData, y: SolveData) =>
    isEmpty(xorWith(x, y, isEqual)) && !(y.length === 0 && x.length === 0);

const CACHE_KEY = 'goodTimesSolvesData';

type CachedSessionData = {
    [key: string]: SolveData;
};

/*

    {
        sessionOne: [],
        sessionTwo: [],
    }

*/

export function getSessionDataFromLocalStorage(sessionId: string): SolveData {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    return dataFromLocalStorage[sessionId] ?? [];
}

export function getSessionListFromLocalStorage(): string[] {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    return Object.keys(dataFromLocalStorage);
}

export function clearLocalStorageForSession(sessionId: string) {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    delete dataFromLocalStorage[sessionId];
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataFromLocalStorage));
}

export function clearAllLocalStorage() {
    localStorage.removeItem(CACHE_KEY);
}

export function saveSessionDataToLocalStorage(solvesData: SolveData, sessionId: string) {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    dataFromLocalStorage[sessionId] = solvesData;
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataFromLocalStorage));
}
