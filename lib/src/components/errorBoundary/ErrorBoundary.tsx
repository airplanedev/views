import { uniqueId } from "lodash-es";
import hash from "object-hash";
import { Component, ErrorInfo, ReactNode } from "react";

import { sendViewMessage } from "message/sendViewMessage";

import { ErrorFallback } from "./ErrorFallback";

export type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * ErrorBoundary is a component that catches errors in its children and displays a fallback UI.
 *
 * This is used in the builder to wrap the entire View to catch any errors that aren't caught by
 * component error boundaries.
 */
export class ErrorBoundary extends Component<
  Props,
  { error?: Error; errorInfo?: ErrorInfo; errorID?: string }
> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorID = uniqueId();
    this.setState({ error, errorInfo, errorID });
    sendViewMessage({
      type: "console",
      id: errorID,
      messageType: "error",
      message: error.message,
      hash: hash(error),
      time: Date.now(),
    });
  }

  render() {
    if (this.state.error && this.state.errorInfo && this.state.errorID) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallback
          errorID={this.state.errorID}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }
    return this.props.children;
  }
}
