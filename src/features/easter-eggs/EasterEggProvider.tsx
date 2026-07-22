import {
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EASTER_EGG_DEFINITIONS, getEasterEggDefinition } from './definitions';
import EasterEggOverlay from './EasterEggOverlay';
import { readSoundPreference, writeSoundPreference } from './storage';
import type { EasterEggId, EasterEggOpenPayload, EasterEggOpenRequest } from './types';

interface EasterEggContextValue {
  activeEgg: EasterEggOpenRequest | null;
  isNightShift: boolean;
  soundEnabled: boolean;
  closeEgg: () => void;
  openEgg: (id: EasterEggId, trigger?: HTMLElement | null, payload?: EasterEggOpenPayload) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleNightShift: () => void;
}

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

export function EasterEggProvider({ children }: { children: ReactNode }): ReactElement {
  const [activeEgg, setActiveEgg] = useState<EasterEggOpenRequest | null>(null);
  const [isNightShift, setIsNightShift] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSoundEnabledState(readSoundPreference());
  }, []);

  useEffect(() => {
    function restoreNightShift(event: KeyboardEvent): void {
      if (event.key === 'Escape' && isNightShift) setIsNightShift(false);
    }

    window.addEventListener('keydown', restoreNightShift);
    return () => window.removeEventListener('keydown', restoreNightShift);
  }, [isNightShift]);

  const openEgg = useCallback(
    (id: EasterEggId, trigger?: HTMLElement | null, payload?: EasterEggOpenPayload): void => {
      const definition = getEasterEggDefinition(id);
      if (!definition?.enabled) return;

      returnFocusRef.current =
        trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setActiveEgg({ id, payload });
    },
    [],
  );

  const closeEgg = useCallback((): void => {
    setActiveEgg(null);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean): void => {
    setSoundEnabledState(enabled);
    writeSoundPreference(enabled);
  }, []);

  const toggleNightShift = useCallback((): void => {
    setIsNightShift((current) => !current);
  }, []);

  const contextValue = useMemo<EasterEggContextValue>(
    () => ({
      activeEgg,
      isNightShift,
      soundEnabled,
      closeEgg,
      openEgg,
      setSoundEnabled,
      toggleNightShift,
    }),
    [activeEgg, closeEgg, isNightShift, openEgg, setSoundEnabled, soundEnabled, toggleNightShift],
  );

  return (
    <EasterEggContext.Provider value={contextValue}>
      {children}
      <EasterEggOverlay
        request={activeEgg}
        definitions={EASTER_EGG_DEFINITIONS}
        onClose={closeEgg}
        returnFocusRef={returnFocusRef}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs(): EasterEggContextValue {
  const context = useContext(EasterEggContext);
  if (!context) throw new Error('useEasterEggs must be used within EasterEggProvider');
  return context;
}
