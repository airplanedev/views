import React, { createContext } from "react";

import { RUNNER_SCALE_SIGNAL_CREATE } from "client/endpoints";
import { Fetcher } from "client/fetcher";

export type RunnerScaleSignal = {
  signalKey: string;
  expirationDurationSeconds: number;
  taskSlug: string;
};

export class RunnerScaleSignalContextType {
  private lastSent: Map<string, Date>;

  constructor() {
    this.lastSent = new Map<string, Date>();
    this.createScaleSignal = this.createScaleSignal.bind(this);
  }

  getMapKey(signal: RunnerScaleSignal) {
    return signal.signalKey + "~" + signal.taskSlug;
  }

  async createScaleSignal(signal: RunnerScaleSignal) {
    const mapKey = this.getMapKey(signal);
    const lastSentDate = this.lastSent.get(mapKey);
    const now = new Date();
    // We only send each signal once a minute at most.
    if (!lastSentDate || new Date(now.getTime() - 60 * 1000) > lastSentDate) {
      this.lastSent.set(mapKey, now);
      const fetcher = new Fetcher();
      await fetcher.post(RUNNER_SCALE_SIGNAL_CREATE, signal);
    }
  }
}

export const RunnerScaleSignalContext =
  createContext<RunnerScaleSignalContextType>(
    new RunnerScaleSignalContextType(),
  );

export type RunnerScaleSignalProviderProps = {
  children: React.ReactNode;
};

export const RunnerScaleSignalProvider = ({
  children,
}: RunnerScaleSignalProviderProps) => {
  return (
    <RunnerScaleSignalContext.Provider
      value={new RunnerScaleSignalContextType()}
    >
      {children}
    </RunnerScaleSignalContext.Provider>
  );
};
