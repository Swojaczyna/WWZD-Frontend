import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  })

  constructor( private overlay: Overlay ) {}

  showLoader(){
    this.overlayRef.attach(new ComponentPortal(LoaderComponent))
  }

  hideLoader() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach()
      this.overlayRef.detachBackdrop()
    }
  }
}
