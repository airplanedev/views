import { uniqueId } from "lodash-es";
import hash from "object-hash";
import { Component, ErrorInfo, ReactNode } from "react";

import { sendViewMessage } from "message/sendViewMessage";

import { ComponentErrorFallback } from "./ComponentErrorFallback";
import { LatestRun } from "./LatestRunDetails";

export type Props = {
  children: ReactNode;
  componentName: string;
  fallback?: ReactNode;
  latestRun?: LatestRun;
};

export class ComponentErrorBoundary extends Component<
  Props,
  { error?: Error; errorInfo?: ErrorInfo; errorID?: string }
> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    sendViewMessage({
      type: "component_mounted",
      componentName: this.props.componentName,
    });
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorID = uniqueId();
    this.setState({ error, errorInfo, errorID });
    sendViewMessage({
      type: "console",
      id: errorID,
      messageType: "error",
      message: error.message,
      component: this.props.componentName,
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
        <ComponentErrorFallback
          errorID={this.state.errorID}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          componentName={this.props.componentName}
          latestRun={this.props.latestRun}
        />
      );
    } else {
      return this.props.children;
    }
  }
}
