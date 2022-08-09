import { Organization } from "../types/Organization";

export interface State {
  layout: Layout;
  paymentInfo: PaymentInfo;
}

export interface PaymentInfo {
  paymentID?: string;
  email?: string;
  ssn?: string;
  full_name?: string;
}

export interface Layout {
  paneNumber: number;
  height: number;
  loading: boolean;
}
export interface Error {
  isVisible: boolean;
  message: string;
}

export enum PaneNumber {
  FirstPane = 0,
  SecondPane = 1,
  ResultPane = 2,
}
