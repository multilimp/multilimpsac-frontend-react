import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook para persistir el estado del tab activo en la URL
 * Permite que al navegar y volver, el tab se mantenga en el mismo lugar
 *
 * @param defaultTab - Tab por defecto si no hay ninguno en la URL (string o número)
 * @param paramName - Nombre del parámetro en la URL (default: 'tab')
 * @returns [activeTab, setActiveTab] - Similar a useState
 *
 * @example
 * // Con strings (Ant Design Tabs)
 * const [activeTab, setActiveTab] = useTabPersistence('oc');
 * // URL: /provider-orders?tab=op
 *
 * @example
 * // Con números (MUI Tabs)
 * const [activeTab, setActiveTab] = useTabPersistence(0);
 * // URL: /sales?tab=1
 */

// Versión para strings
export function useTabPersistenceString(
    defaultTab: string,
    paramName: string = 'tab'
): [string, (newTab: string) => void] {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawValue = searchParams.get(paramName);
    const activeTab = rawValue !== null ? rawValue : defaultTab;

    const setActiveTab = useCallback(
        (newTab: string) => {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);
                    if (newTab === defaultTab) {
                        newParams.delete(paramName);
                    } else {
                        newParams.set(paramName, newTab);
                    }
                    return newParams;
                },
                { replace: true }
            );
        },
        [defaultTab, paramName, setSearchParams]
    );

    return [activeTab, setActiveTab];
}

// Versión para números
export function useTabPersistenceNumber(
    defaultTab: number,
    paramName: string = 'tab'
): [number, (newTab: number) => void] {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawValue = searchParams.get(paramName);
    const activeTab = rawValue !== null ? parseInt(rawValue, 10) : defaultTab;

    const setActiveTab = useCallback(
        (newTab: number) => {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);
                    if (newTab === defaultTab) {
                        newParams.delete(paramName);
                    } else {
                        newParams.set(paramName, String(newTab));
                    }
                    return newParams;
                },
                { replace: true }
            );
        },
        [defaultTab, paramName, setSearchParams]
    );

    return [activeTab, setActiveTab];
}

// Default export - versión general
const useTabPersistence = (defaultTab: string | number, paramName: string = 'tab') => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isNumeric = typeof defaultTab === 'number';

    const rawValue = searchParams.get(paramName);
    const activeTab = rawValue !== null
        ? (isNumeric ? parseInt(rawValue, 10) : rawValue)
        : defaultTab;

    const setActiveTab = useCallback(
        (newTab: string | number) => {
            setSearchParams(
                (prev) => {
                    const newParams = new URLSearchParams(prev);
                    const newTabStr = String(newTab);
                    const defaultTabStr = String(defaultTab);

                    if (newTabStr === defaultTabStr) {
                        newParams.delete(paramName);
                    } else {
                        newParams.set(paramName, newTabStr);
                    }
                    return newParams;
                },
                { replace: true }
            );
        },
        [defaultTab, paramName, setSearchParams]
    );

    return [activeTab, setActiveTab] as [typeof activeTab, typeof setActiveTab];
};

export default useTabPersistence;
