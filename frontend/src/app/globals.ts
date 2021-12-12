import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Globals {
  set isLoading(arg: boolean) {
    setTimeout(() => {
      this.loading.next(arg);
    });
  }
  get isLoading() {
    return this.loading.value;
  }
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
