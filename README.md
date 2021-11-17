# CASFEE_Project2
CASFEE_Project2

## Wireframes
Die Wireframes wurden mit Figma erstellt. Nachfolgend der Link:
https://www.figma.com/file/qvJaNcNgBfPqFlfTFyGoXh/Parkplatzverwaltung?node-id=101%3A1873

## Frontend

#### Keycloak
Für die Authentifizierung wurde der Keycloak (Hosting bei Optimatik AG) verwendet
npm i keycloak-angular keycloak-js

Benutzeraccounts:
- sandro.burkhart@ost.ch / Weiterbildung2021%
- hans.keller@ost.ch / Weiterbildung2021%
- michael.gfeller@ost.ch / Weiterbildung2021%

## Backend
Das Backend basiert auf Python / Django. Die Persistierung ist über eine PostgreSQL gelöst (Gratisaccount ElephantSQL - Begrenzung max. 20 MB Daten)

#### Start Backend
> In den Ordner /backend/ wechseln
> - py manage.py runserver
>
> Anschliessend wird das Backend auf dem Port 8000 gestartet und ist per Browser erreichbar http://localhost:8000

### Modeländerungen in der Datenbank nachführen
> In den Ordner /backend/ wechseln
> - py manage.py makemigrations
> - py manage.py migrate

## Datenbank
> Server: tai.db.elephantsql.com  
> User & DB: cvxpvwab  
> Passwort: h0ZpU_iEYFZk9PaaeVEVE6_BVCYuOQxF