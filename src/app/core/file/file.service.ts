import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StoredFile } from './file.types';
import { Observable, catchError, of, switchMap, take } from 'rxjs';
import { UserService } from '../user/user.service';
import { CreateFileDto, CreateFilesDto } from './file.dto';

@Injectable({ providedIn: 'root' })
export class StoredFileService {

  /**
   * Constructor
   */
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _userService: UserService
  ) { }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Get all files owned or shared to the current user
   */
  getAll(): Observable<StoredFile[]> {
    return this._userService.user$
      .pipe(
        take(1),
        switchMap(({ id }) => this._httpClient.get<StoredFile[]>(`@api/files/${id}`)),
        catchError(() => of([]))
      )
  }

  /**
   * Add a file in the user's bucket
   * @param payload
   * @returns
   */
  create(payload: Pick<CreateFileDto, 'file'>): Observable<unknown> {
    return this._userService.user$
      .pipe(
        take(1),
        switchMap(({ id: userId }) => {
          const formData = new FormData();
          Object.entries(payload).forEach(([key, value]) => formData.set(key, value));
          return this._httpClient.post<unknown>(`@api/files/${userId}`, formData);
        })
      );
  }

  /**
   * Add multiple files at once in the user's bucket
   * @param payload
   * @returns
   */
  createMultiple({ files }: Pick<CreateFilesDto, 'files'>): Observable<unknown> {
    return this._userService.user$
      .pipe(
        take(1),
        switchMap(({ id: userId }) => {
          const formData = new FormData();
          for (let index = 0; index < files.length; index++) {
            formData.append(`files`, files[index]);

          }
          return this._httpClient.post<unknown>(`@api/files/${userId}/multiple`, formData);
        })
      );
  }

  /**
   * Send a request to the backend to perform a **PERMANENT** delete
   *
   * @param file
   */
  delete(file: StoredFile): Observable<unknown> {
    return this._userService.user$
      .pipe(
        take(1),
        switchMap(({ id: userId }) => this._httpClient.delete<unknown>(`@api/files/${userId}/${file.name}`))
      );
  }

  /**
   * Send a request to the backend to perform
   * a **PERMANENT** delete of multiple files
   *
   * @param files
   */
  deleteMultiple(...files: StoredFile[]): Observable<unknown> {
    return this._userService.user$
      .pipe(
        take(1),
        switchMap(({ id: userId }) => this._httpClient.delete<unknown>(
          `@api/files/${userId}`,
          {
            params: new HttpParams({
              fromObject: {
                filenames: files.map(file => file.name)
              }
            })
          }))
      );
  }
}
