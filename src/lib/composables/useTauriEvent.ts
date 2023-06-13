import type { Option } from '@app/types';
import type { Event, EventName } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

export const useTauriEvent = <T>(
  key: EventName,
  callback: (payload: Event<T>) => void
): (() => void) => {
  let unlistenFn: Option<() => void> = null;

  listen(key, callback).then((cleanup) => {
    unlistenFn = cleanup;
  });

  return () => {
    if (unlistenFn) {
      unlistenFn();
    }
  };
};
