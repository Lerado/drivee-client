import { AfterViewInit, Component, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoredFileService } from 'app/core/file/file.service';
import { UserService } from 'app/core/user/user.service';
import { FileListTableComponent } from './components/file-list-table/file-list-table.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StoredFile } from 'app/core/file/file.types';
import { AddFilesFormComponent } from './components/add-files-form/add-files-form.component';
import { CreateFilesDto } from 'app/core/file/file.dto';
import { tap, iif } from 'rxjs';
import { ApiErrorHandler } from 'app/core/api/utils/error-handler.service';
import { AuthPipe } from 'app/core/auth/auth.pipe';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatButtonModule, MatDialogModule, AuthPipe, FileListTableComponent, AddFilesFormComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('addFileFormDialog') private _addFileFormDialog!: TemplateRef<AddFilesFormComponent>;
  private _addFileFormDialogRef!: MatDialogRef<AddFilesFormComponent>;

  @ViewChild(MatSort) private _sort!: MatSort;
  @ViewChild(MatPaginator) private _paginator!: MatPaginator;

  user = toSignal(this._userService.user$, { requireSync: true });
  files = toSignal(this._fileService.getAll(), { initialValue: [] });
  filesDataSource = computed(() => new MatTableDataSource<StoredFile>(this.files()));

  selection = new SelectionModel<StoredFile>(true, [], true, ((fileA, fileB) => fileA.name.localeCompare(fileB.name) === 0));
  selectionChange = toSignal(this.selection.changed);
  isAllSelected = computed(() => {
    return this.selectionChange() && this.filesDataSource().data.length === this.selection.selected.length
  })
  bulkActionsActive = signal(false);
  displayedColumns = computed(() => {
    const columns = ['name', 'originalName', 'extension', 'createdAt', 'actions'];
    if (this.bulkActionsActive()) {
      columns.unshift('select');
    }
    return columns;
  })

  /**
   * Constructor
   */
  constructor(
    private readonly _userService: UserService,
    private readonly _fileService: StoredFileService,
    private readonly _dialog: MatDialog,
    private readonly _errorHandler: ApiErrorHandler
  ) { }

  // -------------------------------------------------------------------
  // @ Lifecycle hooks
  // -------------------------------------------------------------------

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.filesDataSource = computed(() => {
      const dataSource = new MatTableDataSource<StoredFile>(this.files());
      dataSource.paginator = this._paginator;
      dataSource.sort = this._sort;
      return dataSource;
    });
  }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Open file form dialog
   */
  openFileFormDialog(): void {
    this._addFileFormDialogRef = this._dialog.open(this._addFileFormDialog, { width: '42vw' });
  }

  /**
   * Select all rows if they are not all selected, deselect all otherwise
   */
  toggleAllRows($event?: MatCheckboxChange): void {

    if (!$event) return;

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.filesDataSource().data)
  }

  /**
   * Toggle bulk actins
   */
  toggleBulkActions(): void {
    this.bulkActionsActive.set(!this.bulkActionsActive());
  }

  /**
   * Add new file
   */
  addFiles(payload: Pick<CreateFilesDto, 'files'>): void {
    // Add file then reload the items
    this._fileService.createMultiple(payload)
      .pipe(
        tap(() => this._refreshDataSource())
      )
      .subscribe({
        next: () => this._addFileFormDialogRef.close(),
        error: error => this._errorHandler.handle(error)
      });
  }

  /**
   * Bulk delete
   */
  bulkDelete(): void {
    if (this.selection.isEmpty()) return;
    this.deleteFiles(...this.selection.selected);
    this.selection.clear();
  }

  /**
   * Permanently delete input files
   *
   * @param files
   */
  deleteFiles(...files: StoredFile[]): void {

    if (!files.length) return;

    iif(
      () => files.length < 2,
      this._fileService.delete(files[0]),
      this._fileService.deleteMultiple(...files)
    )
      .pipe(
        tap(() => this._refreshDataSource())
      )
      .subscribe({
        error: error => this._errorHandler.handle(error)
      });
  }

  // -------------------------------------------------------------------
  // @ Private methods
  // -------------------------------------------------------------------

  /**
   * Refresh datasource by reloading from the backend
   */
  private _refreshDataSource(): void {
    this._fileService.getAll().pipe(
      tap((items) => {
        this.files = signal(items);
        this.filesDataSource = computed(() => new MatTableDataSource<StoredFile>(this.files()));
        this.filesDataSource = computed(() => {
          const dataSource = new MatTableDataSource<StoredFile>(this.files());
          dataSource.paginator = this._paginator;
          dataSource.sort = this._sort;
          return dataSource;
        });
        this.isAllSelected = computed(() => {
          return this.selectionChange() && this.filesDataSource().data.length === this.selection.selected.length
        })
      })
    )
      .subscribe();
  }
}
