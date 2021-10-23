export interface DeleteMessage {
    status: boolean;
    message: string;
  }

export class DeleteMessage implements DeleteMessage {
    constructor(status: boolean, message: string) {
        this.status = status;
        this.message = message;
    }
}