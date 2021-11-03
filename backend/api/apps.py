import json
import ssl

from django.apps import AppConfig
from django.conf import settings
from six.moves import urllib
from cryptography import x509
from cryptography.hazmat import backends

# Don't verify ssl Certificates
ssl._create_default_https_context = ssl._create_unverified_context

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Load Public Key (as Certificate) from Keycloak-Realm
        # ------------------------------------
        #return None
        try: # (A) Load keys from url...
            url = settings.KEYCLOAK['HOST']+"/auth/realms/" + settings.KEYCLOAK['REALM_NAME']+"/protocol/openid-connect/certs"
            response = urllib.request.urlopen(url)
            # Response-Format: 
            # {
            #     "keys": [
            #         {
            #         "kid": "sFkzNoS9...8yQNR40",
            #         "kty": "RSA",
            #         "alg": "RS256",
            #         "use": "sig",
            #         "n": "gLfOWIww2M...tFrBG_w",
            #         "e": "AQAB",
            #         "x5c": [
            #             "MIIClTCCAX...Fq5EyBWe53G5gk="
            #         ],
            #         "x5t": "p7R_1_Lwk...NtfNwCw",
            #         "x5t#S256": "76RGrg4I...MLFmNWB3So"
            #         }
            #     ]
            # }
        except Exception as ex:
            #"message": f"Request on '{dj_settings.KEYCLOAK_PUBLIC_KEY_URL}' failed! Check if url is reachable...", \ 
            message = {    "error": "request.urlopen()",
            "message": f"Request on '{url}' failed! Check if url is reachable...", 
                "exception":{   "type":str(ex.__class__.__name__),
                                "message":str(ex), 
                            }
            } 
            raise Exception(message)

        try: # (B) Extract Public Key as Certificate out of response
            json_response = json.loads(response.read().decode('utf-8'))
            cert = '-----BEGIN CERTIFICATE-----\n' + json_response['keys'][0]['x5c'][0] + '\n-----END CERTIFICATE-----'
            cert = x509.load_pem_x509_certificate(cert.encode('utf-8'), backends.default_backend())
            pki = cert.public_key()
        except Exception as ex:
            message = {    "error": "extracting pki",
            "message": f"Error during extracting pki out of json-response of Keycloak! Debug section...",
                "exception":{   "type":str(ex.__class__.__name__),
                                "message":str(ex),
                            }
            } 
            raise Exception(message)

        # (C) Write result back to settings...
        settings.JWT_AUTH['JWT_PUBLIC_KEY'] = pki