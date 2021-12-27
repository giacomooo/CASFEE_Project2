import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Globals {
  loading = new BehaviorSubject(false);

  set isLoading(value: boolean) {
    this.loading.next(value);
  }
}
