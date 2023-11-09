import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateFilesDto } from 'app/core/file/file.dto';

@Component({
  selector: 'add-files-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './add-files-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFilesFormComponent {

  @ViewChild('fileInput') private readonly _fileInput!: ElementRef<HTMLInputElement>;

  @Output() cancel = new EventEmitter<unknown>();
  @Output() submitChanges = new EventEmitter<Pick<CreateFilesDto, 'files'>>();

  addFileForm = this._formBuilder.group({
    files: new FormControl<File[]>([], Validators.minLength(1))
  })

  /**
   * Constructor
   */
  constructor(
    private readonly _formBuilder: FormBuilder
  ) { }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Reset form
   */
  reset(): void {
    this.addFileForm.reset();
    this.cancel.emit();
  }

  /**
   * Submit
   */
  submit(): void {
    if (this.addFileForm.invalid) return;
    this.submitChanges.emit({ files: this._fileInput.nativeElement.files } as Pick<CreateFilesDto, 'files'>);
  }
}
