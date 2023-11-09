import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar"
import { ApiErrorResponse } from "../api.types";

@Injectable()
export class ApiErrorHandler {

  /**
   * Constructor
   */
  constructor(
    private readonly _matSnackbar: MatSnackBar
  ) { }

  /**
   * Handle error
   *
   * @param error
   */
  handle(this: ApiErrorHandler, error: ApiErrorResponse) {
    this._matSnackbar.open(error.message);
  }
}
