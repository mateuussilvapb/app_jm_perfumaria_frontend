import { $dt } from '@primeng/themes';
//Angular
import { Subject } from 'rxjs';
import { computed, Injectable, signal } from '@angular/core';

//Internos
import { ScreenSizeService } from './screen-size.service';

interface LayoutConfig {
  // preset?: string;
  // primary?: string;
  // surface?: string | undefined | null;
  darkTheme?: boolean;
  // menuMode?: string;
}

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

  _config: LayoutConfig = {
    darkTheme: false,
  };

  public state: LayoutState = {
    mainMenuVisible: this.isDesktop,
    sidebarMenuOptionsVisible: false,
  };

  constructor(private readonly screenSizeService: ScreenSizeService) {
    this.screenResize();
  }

  layoutConfig = signal<LayoutConfig>(this._config);

  private screenResize() {
    this.screenSizeService.width$.subscribe((width) => {
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

  isDarkTheme = computed(() => this.layoutConfig().darkTheme);

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

  onToggleTheme() {
    const body = document.body;
    if (!this.isDarkTheme()) {
      body.style.backgroundColor = $dt('gray.100').value;
    } else {
      body.style.backgroundColor = $dt('zinc.950').value;
    }
    body.style.transition = 'background-color 0.3s ease';
  }
}
