//Angular
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

//Internos
import { ScreenSizeService } from './screen-size.service';

interface LayoutState {
  mainMenuVisible: boolean;
  sidebarMenuOptionsVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly menuToggle = new Subject<boolean>();
  public menuToggle$ = this.menuToggle.asObservable();

  public state: LayoutState = {
    mainMenuVisible: this.isDesktop,
    sidebarMenuOptionsVisible: false,
  };

  constructor(private readonly  screenSizeService: ScreenSizeService) {
    this.screenResize();
  }

  private screenResize() {
    this.screenSizeService.width$.subscribe(width => {
      if (width > 991) {
        this.state.mainMenuVisible = true;
      } else {
        this.state.mainMenuVisible = false;
      }
    });
  }

  showMobileSidebar() {
    this.state.sidebarMenuOptionsVisible = true;
  }

  onMenuToggle() {
    this.state.mainMenuVisible = !this.state.mainMenuVisible;
    this.menuToggle.next(this.state.mainMenuVisible);
  }

  get isDesktop() {
    return window.innerWidth > 991;
  }

  get isBigDesktop() {
    return window.innerWidth > 1710;
  }

  get isMobile() {
    return !this.isDesktop;
  }

  get mainMenuVisible() {
    return this.state.mainMenuVisible;
  }

  set mainMenuVisible(_val: boolean) {
    this.state.mainMenuVisible = _val;
  }
}
