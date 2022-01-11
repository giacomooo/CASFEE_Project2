# CASFEE_Project2
CASFEE_Project2

## Highlights
- Einsatz von Backend auf Basis von Python/Django
- ORM Mapper durch Python im Einsatz 
- Implementation von Keycloak als UAM über OIDC
- Integrationstests mit Cypress
- Linting mit Pylint und eslint
- Verwendung optimierter Bilder (WebP)
- Repsonsive Design, Mobile First
- Postman Collection
- Wireframes mit Figma


## Github Repo
https://github.com/giacomooo/CASFEE_Project2

## Wireframes
Die Wireframes wurden mit Figma erstellt. Nachfolgend der Link:
https://www.figma.com/file/qvJaNcNgBfPqFlfTFyGoXh/Parkplatzverwaltung?node-id=101%3A1873

## Postman Collection
https://galactic-capsule-711286.postman.co/workspace/ee9366be-72c8-4814-b1b8-b3e40de4dab0/request/2587017-89cc58af-0a32-4c3d-955e-01e9996f80e6


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

## Linting

### Python/Django
#### Execute
> pylint api --load-plugins pylint_django --django-settings-module=parkplatzverwaltung.settings
> pylint parkplatzverwaltung --load-plugins pylint_django --django-settings-module=parkplatzverwaltung.settings

#### Install
> pip install pylint
> pylint --generate-rcfile | out-file -encoding utf8 .pylintrc
> pylint --rcfile=.pylintrc

> pip install pylint-django
> pylint --load-plugins pylint_django --load-plugins pylint_django.checkers.migrations

## Integrations Tests
#### Execute
> npx cypress run