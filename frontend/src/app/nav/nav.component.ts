import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public userProfile?: KeycloakProfile;
  public isLoggedIn: Boolean = false;
  public appTitle: String = "Parkplatzverwaltung";

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private readonly keycloak: KeycloakService, private breakpointObserver: BreakpointObserver, public router: Router) {
    console.log(router.url);
    
    router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case "/account": {
            this.appTitle = `${this.userProfile?.firstName}  ${this.userProfile?.lastName}`;
            break;
          }
          default: {
            this.appTitle = "Parkplatzverwaltung";
            break;
          }
        }
        console.log(event.url);
        
      }
    });
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }
}
