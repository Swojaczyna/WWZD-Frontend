import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-title-screen',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule],
  host: {class: 'flex flex-col grow relative text-white main-view'},
  templateUrl: './title-screen.component.html',
  styleUrl: './title-screen.component.scss'
})

export class TitleScreenComponent {
  iconValue = faChevronRight
  router = inject(Router)

}
