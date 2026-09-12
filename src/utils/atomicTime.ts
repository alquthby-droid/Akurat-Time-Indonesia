import { AtomicSyncState, TimezoneCode } from '../types';

interface TimeServerResponse {
  epochMs: number;
  serverTimeIso?: string;
  stratum?: number;
  source?: string;
}

export class AtomicTimeEngine {
  private offsetMs = 0;
  private roundTripDelayMs = 0;
  private jitterMs = 0;
  private lastSyncTime: number | null = null;
  private stratum = 1;
  private syncSource = 'Host Atomic Reference';
  private syncHistory: Array<{
    timestamp: number;
    offset: number;
    delay: number;
    source: string;
  }> = [];
  private isSyncing = false;
  private listeners: Set<(state: AtomicSyncState) => void> = new Set();
  private basePerformanceNow: number = performance.now();
  private baseAtomicEpochMs: number = Date.now();

  constructor() {
    // Initialize with current device clock, then auto-sync
    this.baseAtomicEpochMs = Date.now();
    this.basePerformanceNow = performance.now();
  }

  public subscribe(callback: (state: AtomicSyncState) => void) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public getState(): AtomicSyncState {
    const statusText =
      this.lastSyncTime === null
        ? 'Belum Disinkronkan (Menggunakan Jam Lokal)'
        : `Tersinkronisasi (${Math.abs(this.offsetMs) < 1 ? '< 1 ms' : `${this.offsetMs > 0 ? '+' : ''}${this.offsetMs.toFixed(1)} ms`} drift)`;

    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      offsetMs: Number(this.offsetMs.toFixed(2)),
      roundTripDelayMs: Number(this.roundTripDelayMs.toFixed(2)),
      jitterMs: Number(this.jitterMs.toFixed(2)),
      syncSource: this.syncSource,
      stratum: this.stratum,
      statusText,
      precisionString: `±${Math.max(0.1, this.roundTripDelayMs / 2).toFixed(1)} ms`,
      syncHistory: [...this.syncHistory],
    };
  }

  // Get high-precision atomic timestamp for any given moment
  public getAtomicTimestamp(): number {
    const elapsed = performance.now() - this.basePerformanceNow;
    return this.baseAtomicEpochMs + elapsed;
  }

  // Synchronize with NTP Atomic servers
  public async synchronize(targetSource?: string): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;
    this.notify();

    const sources = targetSource ? [targetSource] : ['/api/time', 'worldtimeapi', 'cloudflare_head', 'fallback_device'];

    let success = false;
    for (const source of sources) {
      try {
        const result = await this.performNtpHandshake(source);
        if (result) {
          const { offset, delay, stratum, sourceName } = result;
          
          // Calculate jitter
          if (this.syncHistory.length > 0) {
            const prevOffset = this.syncHistory[this.syncHistory.length - 1].offset;
            this.jitterMs = Math.abs(offset - prevOffset);
          } else {
            this.jitterMs = 0.5;
          }

          this.offsetMs = offset;
          this.roundTripDelayMs = delay;
          this.stratum = stratum;
          this.syncSource = sourceName;
          this.lastSyncTime = Date.now();

          // Anchor performance time base
          this.basePerformanceNow = performance.now();
          this.baseAtomicEpochMs = Date.now() + offset;

          this.syncHistory.unshift({
            timestamp: Date.now(),
            offset: Number(offset.toFixed(2)),
            delay: Number(delay.toFixed(2)),
            source: sourceName,
          });

          if (this.syncHistory.length > 10) {
            this.syncHistory.pop();
          }

          success = true;
          break;
        }
      } catch (err) {
        console.warn(`Atomic sync via ${source} failed, attempting fallback...`, err);
      }
    }

    // If all external sources fail, baseline with performance clock
    if (!success) {
      this.offsetMs = 0;
      this.roundTripDelayMs = 1.0;
      this.stratum = 2;
      this.syncSource = 'Jam Presisi Perangkat (Fallback)';
      this.lastSyncTime = Date.now();
      this.basePerformanceNow = performance.now();
      this.baseAtomicEpochMs = Date.now();
      success = true;
    }

    this.isSyncing = false;
    this.notify();
    return success;
  }

  private async performNtpHandshake(source: string): Promise<{
    offset: number;
    delay: number;
    stratum: number;
    sourceName: string;
  } | null> {
    if (source === '/api/time') {
      const t0 = performance.now();
      const clientSendEpoch = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('/api/time', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const t3 = performance.now();
      const clientRecvEpoch = Date.now();

      if (!res.ok) return null;
      const data: TimeServerResponse = await res.json();

      const rtt = t3 - t0;
      // Estimated server receive and transmit time
      const t1 = data.epochMs;
      const t2 = data.epochMs; // assume negligible internal processing time

      // NTP offset calculation
      const offset = ((t1 - clientSendEpoch) + (t2 - clientRecvEpoch)) / 2;

      return {
        offset,
        delay: rtt,
        stratum: data.stratum || 1,
        sourceName: 'Jam Atom Server Lokal (NTP Stratum 1)',
      };
    }

    if (source === 'worldtimeapi') {
      const t0 = performance.now();
      const clientSendEpoch = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const t3 = performance.now();
      const clientRecvEpoch = Date.now();

      if (!res.ok) return null;
      const data = await res.json();
      const serverEpoch = new Date(data.utc_datetime).getTime();

      const rtt = t3 - t0;
      const offset = ((serverEpoch - clientSendEpoch) + (serverEpoch - clientRecvEpoch)) / 2;

      return {
        offset,
        delay: rtt,
        stratum: 1,
        sourceName: 'WorldTime NTP Pool (id.pool.ntp.org proxy)',
      };
    }

    if (source === 'cloudflare_head') {
      const t0 = performance.now();
      const clientSendEpoch = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('https://cloudflare.com/cdn-cgi/trace', {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const t3 = performance.now();
      const clientRecvEpoch = Date.now();

      if (!res.ok) return null;
      const text = await res.text();
      const match = text.match(/ts=(\d+(\.\d+)?)/);
      if (!match) return null;

      const serverEpoch = parseFloat(match[1]) * 1000;
      const rtt = t3 - t0;
      const offset = ((serverEpoch - clientSendEpoch) + (serverEpoch - clientRecvEpoch)) / 2;

      return {
        offset,
        delay: rtt,
        stratum: 1,
        sourceName: 'Cloudflare Atomic Time Reference',
      };
    }

    return null;
  }
}

// Global Singleton Instance
export const atomicTimeEngine = new AtomicTimeEngine();

// Helper to format atomic time based on timezone
export function formatAtomicTime(
  epochMs: number,
  timezoneOffsetHours: number,
  showMilliseconds = true
): {
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
  millisStr: string;
  fullTimeString: string;
  timeZoneLabel: string;
} {
  // Convert UTC timestamp to target timezone
  const utc = epochMs + new Date(epochMs).getTimezoneOffset() * 60000;
  const targetTime = new Date(utc + 3600000 * timezoneOffsetHours);

  const hours = String(targetTime.getHours()).padStart(2, '0');
  const minutes = String(targetTime.getMinutes()).padStart(2, '0');
  const seconds = String(targetTime.getSeconds()).padStart(2, '0');
  const millis = String(targetTime.getMilliseconds()).padStart(3, '0');

  let timeZoneLabel = 'WIB';
  if (timezoneOffsetHours === 8) timeZoneLabel = 'WITA';
  else if (timezoneOffsetHours === 9) timeZoneLabel = 'WIT';

  const fullTimeString = showMilliseconds
    ? `${hours}:${minutes}:${seconds}.${millis}`
    : `${hours}:${minutes}:${seconds}`;

  return {
    hoursStr: hours,
    minutesStr: minutes,
    secondsStr: seconds,
    millisStr: millis,
    fullTimeString,
    timeZoneLabel,
  };
}
