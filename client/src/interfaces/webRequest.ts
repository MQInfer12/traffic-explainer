export interface WebRequest {
  id: string;
  url: string;
  statusCode: number;
  method: string;
  timeStamp: number;
  type: string;
  initiator: string;
}

export type SuspiciousRequestJSON = Record<string, string>;
