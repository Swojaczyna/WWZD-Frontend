import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModelService } from '../../services/model.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-data-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './add-data-modal.component.html',
  styleUrl: './add-data-modal.component.scss'
})
export class AddDataModalComponent {

  modelService = inject(ModelService)
  dialogRef = inject(MatDialogRef<AddDataModalComponent>)

  multipartFormGroup = new FormGroup({
    file: new FormControl(),
    songText: new FormControl()
  })

  postSong() {
    setTimeout(() => {

    }, 1000)
    this.modelService.scheduleAsyncJob()
  }
}
