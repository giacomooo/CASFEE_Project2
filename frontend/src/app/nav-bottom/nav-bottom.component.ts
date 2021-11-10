import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Globals } from '../globals';

@Component({
  selector: 'app-nav-bottom',
  templateUrl: './nav-bottom.component.html',
  styleUrls: ['./nav-bottom.component.scss']
})
export class NavBottomComponent implements OnInit {
  public userProfile?: KeycloakProfile;
  public isLoggedIn: Boolean = false;
  public appTitle: String = "Parkplatzverwaltung";

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private readonly keycloak: KeycloakService, private breakpointObserver: BreakpointObserver, public router: Router, public globals: Globals) {

    router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith(`/account`)) {
          this.appTitle = `${this.userProfile?.firstName}  ${this.userProfile?.lastName}`;
        }
        else if (event.url.startsWith(`/reservation`)){
          this.appTitle = `Meine Reservationen`;
        }
        else if (event.url.startsWith(`/parkingAdministrationItemEdit?`)){
          this.appTitle = `Meinen Parkplatz verwalten`;
        }
        else if (event.url.startsWith(`/parkingAdministrationItemEdit`)){
          this.appTitle = `Meinen Parkplatz hinzufügen`;
        }
        else if (event.url.startsWith(`/parkingAdministration`)){
          this.appTitle = `Meine Parkplätze verwalten`;
        }
        else if (event.url.startsWith(`/parking`)){
          this.appTitle = `Parkplatz finden`;
        }
        else {
          this.appTitle = `Parkplatzverwaltung`;
        }

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
