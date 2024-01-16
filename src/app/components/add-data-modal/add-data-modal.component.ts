import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModelService } from '../../services/model.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderService } from '../../services/loader.service';
import { Observable, delay, filter, mergeMap, repeatWhen, take, tap, timeout, timer } from 'rxjs';

@Component({
  selector: 'app-add-data-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './add-data-modal.component.html',
  styleUrl: './add-data-modal.component.scss'
})
export class AddDataModalComponent {

  modelService = inject(ModelService)
  loaderService = inject(LoaderService)
  dialogRef = inject(MatDialogRef<AddDataModalComponent>)

  multipartFormGroup = new FormGroup({
    file: new UntypedFormControl('', [Validators.required]),
    songText: new FormControl(undefined, [Validators.required])
  })

  postSong() {
    if (!this.multipartFormGroup.valid) return

    this.loaderService.showLoader()
    this.modelService.scheduleAsyncJob(
      this.multipartFormGroup.controls.file.value[0],
      this.multipartFormGroup.controls.songText.value
    ).subscribe((returnedId) => {
      console.log(returnedId)

      timer(0, 2000)
        .pipe(
          mergeMap(() => this.modelService.getJobStatus(returnedId.identifier ?? 0)),
          filter(r => r.status == "FINISHED"),
          take(1),
          timeout(30000)
        ).subscribe(() => {
          this.loaderService.hideLoader()
          this.dialogRef.close(returnedId)
        })
    })
  }

  onFileSelect(files: File[]) {
    if (!files) return;
    this.multipartFormGroup.controls.file.setValue([...files]);
  }
}
