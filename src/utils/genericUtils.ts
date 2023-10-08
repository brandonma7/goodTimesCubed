import { isEmpty, xorWith, isEqual } from 'lodash';
import { SolveData } from '../components/Timer';
import { PuzzleType, Solve } from './cubingUtils';

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

export type SessionType = 'normal' | 'splits' | 'cfopTrainer' | 'yauTrainer';

export const SessionTypeMap = {
    normal: 'Normal',
    splits: 'Splits',
    cfopTrainer: 'CFOP Trainer',
    yauTrainer: 'Yau Trainer',
};
export type SessionData = {
    id: string;
    name: string;
    type: PuzzleType;
    data: SolveData;
    sessionType: SessionType;
    numSplits: number;
};
type CachedSessionData = {
    [key: string]: SessionData;
};

/*

    {
        sessionOne: [],
        sessionTwo: [],
        sessionId: {
            name: 'Session 1',
            type: '3x3x3',
            data: []
        }
    }

*/

export function getSessionDataFromLocalStorage(sessionId: string): SessionData {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    if (Object.keys(dataFromLocalStorage).length === 0) {
        return {
            id: 'session1',
            name: 'Session 1',
            type: '3x3x3',
            data: [],
            sessionType: 'normal',
            numSplits: 1,
        };
    }
    return dataFromLocalStorage[sessionId];
}

export function getSessionListFromLocalStorage(): string[] {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    const sessionList = Object.keys(dataFromLocalStorage);
    return sessionList.length === 0 ? ['session1'] : sessionList;
}

export function getSessionNamesFromLocalStorage(): { id: string; name: string; type: PuzzleType }[] {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    const sessionNameList = Object.keys(dataFromLocalStorage).map((sessionId) => {
        const { name, type } = dataFromLocalStorage[sessionId];
        return { id: sessionId, name, type };
    });
    return sessionNameList.length === 0 ? [{ id: 'sessionId', name: 'Session 1', type: '3x3x3' }] : sessionNameList;
}

export function clearLocalStorageForSession(sessionId: string) {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    delete dataFromLocalStorage[sessionId];
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataFromLocalStorage));
}

export function clearAllLocalStorage() {
    localStorage.removeItem(CACHE_KEY);
}

export function saveSessionDataToLocalStorage(sessionData: SessionData) {
    const { id } = sessionData;
    const dataFromLocalStorage = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CachedSessionData;
    dataFromLocalStorage[id] = sessionData;
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataFromLocalStorage));
}

const defaultValuesOfType = {
    string: '',
    number: 0,
    array: [],
    function: () => null,
    bigint: 0,
    boolean: false,
    symbol: 0,
    undefined: undefined,
    object: {},
};

export function getLast<T>(list: T[]): unknown {
    return list.length ? list[list.length - 1] : defaultValuesOfType[typeof list];
}

export function getRandomFromList(list: []) {
    return list[getRand(list.length)];
}
