import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Input, QueryList, ViewChild } from '@angular/core';
import { MatColumnDef, MatHeaderRowDef, MatNoDataRow, MatRowDef, MatTable, MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { StoredFile } from 'app/core/file/file.types';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'file-list-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatChipsModule, CdkDrag, CdkDropList, DatePipe],
  templateUrl: './file-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListTableComponent<T = StoredFile> implements AfterContentInit {

  @ContentChildren(MatHeaderRowDef) headerRowsDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowsDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnsDefs!: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRowDef!: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;

  @Input() columns: string[] = ['name', 'originalName', 'extension', 'createdAt'];
  @Input({ required: true }) dataSource!: DataSource<T>;


  // -------------------------------------------------------------------
  // @ Lifecycle hooks
  // -------------------------------------------------------------------

  /**
   * After content init
   */
  ngAfterContentInit(): void {
    this.headerRowsDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    this.rowsDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.columnsDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.table.setNoDataRow(this.noDataRowDef);
  }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Drag and drop module
   *
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
