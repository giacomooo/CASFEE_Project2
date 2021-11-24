export interface DeleteMessageInterface {
    status: boolean;
    message: string;
  }

export class DeleteMessage implements DeleteMessageInterface {
  status: boolean;
  message: string;

  constructor(status: boolean, message: string) {
    this.status = status;
    this.message = message;
  }
}
