import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center gap-2">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
  `
})

export class LoaderComponent {}
