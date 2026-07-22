import { type ReactElement, type RefObject, lazy, Suspense, useEffect, useId, useRef } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { playAudioCue } from './audio';
import type { EasterEggDefinition, EasterEggOpenRequest, EasterEggId } from './types';

const BuildShipGame = lazy(() => import('./BuildShipGame'));
const EggPanels = lazy(() => import('./EggPanels'));

interface EasterEggOverlayProps {
  request: EasterEggOpenRequest | null;
  definitions: readonly EasterEggDefinition[];
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

function LoadingPanel(): ReactElement {
  return (
    <div className="after-hours-loading" role="status">
      Opening after-hours file…
    </div>
  );
}

export default function EasterEggOverlay({
  request,
  definitions,
  onClose,
  returnFocusRef,
  soundEnabled,
  setSoundEnabled,
}: EasterEggOverlayProps): ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!request) return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    headingRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [request, returnFocusRef]);

  if (!request || typeof document === 'undefined') return null;

  const definition = definitions.find((item) => item.id === request.id);
  if (!definition) return null;
  const activeRequest = request;

  function toggleSound(): void {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    playAudioCue('tap', nextValue);
  }

  function renderBody(id: EasterEggId): ReactElement {
    if (id === 'build-ship') {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <BuildShipGame soundEnabled={soundEnabled} onClose={onClose} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<LoadingPanel />}>
        <EggPanels
          id={id}
          payload={activeRequest.payload}
          soundEnabled={soundEnabled}
          onClose={onClose}
        />
      </Suspense>
    );
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="after-hours-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="after-hours-frame">
        <header className="after-hours-header">
          <div className="min-w-0">
            <div className="after-hours-kicker">After-hours file</div>
            <h2 ref={headingRef} id={titleId} tabIndex={-1} className="after-hours-title">
              {definition.label}
            </h2>
            <p id={descriptionId} className="after-hours-description">
              {definition.description} No collection state, account, or network connection is used.
            </p>
          </div>
          <div className="after-hours-actions">
            {definition.id !== 'night-shift' ? (
              <button
                type="button"
                className="after-hours-icon-button"
                aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
                aria-pressed={soundEnabled}
                onClick={toggleSound}
              >
                {soundEnabled ? (
                  <Volume2 size={18} aria-hidden="true" />
                ) : (
                  <VolumeX size={18} aria-hidden="true" />
                )}
                <span className="sr-only">Sound {soundEnabled ? 'on' : 'off'}</span>
              </button>
            ) : null}
            <button
              type="button"
              className="after-hours-icon-button"
              aria-label="Close after-hours file"
              data-easter-close="true"
              onClick={onClose}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="after-hours-content">{renderBody(activeRequest.id)}</div>
      </div>
    </dialog>,
    document.body,
  );
}
