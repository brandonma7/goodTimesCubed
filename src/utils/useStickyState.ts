import isEqual from 'lodash/isEqual';
import { useCallback, useState } from 'react';

export default function useStickyState<T>(defaultValue: T, key: string) {
    const storage = window.localStorage;

    const [value, setValue] = useState(() => {
        const stickyValue = storage.getItem(key);
        return stickyValue !== null ? (JSON.parse(stickyValue) as T) : defaultValue;
    });

    const setNewValue = useCallback(
        (newValue: T) => {
            if (!isEqual(value, newValue)) {
                storage.setItem(key, JSON.stringify(newValue));
                setValue(newValue);
            }
        },
        [value, key, storage],
    );

    return [value, setNewValue] as const;
}
