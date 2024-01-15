import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-add-data-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './add-data-modal.component.html',
  styleUrl: './add-data-modal.component.scss'
})
export class AddDataModalComponent {

  modelService = inject(ModelService)

  multipartFormGroup = new FormGroup({
    file: new FormControl(),
    songText: new FormControl()
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  postSong() {
    setTimeout(() => {

    }, 1000)
    this.modelService.scheduleAsyncJob()
  }
}
