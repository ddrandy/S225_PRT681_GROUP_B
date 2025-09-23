import { Component, type ReactNode } from "react";
export class ErrorBoundary extends Component<{ children: ReactNode }, { err?: Error }> {
  state = { err: undefined as Error | undefined };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    return this.state.err
      ? <div className="p-6">Something went wrong. Please refresh.</div>
      : this.props.children;
  }
}