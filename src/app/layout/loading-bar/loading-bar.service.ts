import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoadingBarService {

  private readonly _loading = new BehaviorSubject<boolean>(false);

  /**
   * Constructor
   */
  constructor() { }

  // -------------------------------------------------------------------
  // @ Accessors
  // -------------------------------------------------------------------

  /**
   * Getter and setter for loading
   */
  get loading$(): Observable<boolean> {
    return this._loading.asObservable();
  }
  set loading(value: boolean) {
    this._loading.next(value);
  }
}
