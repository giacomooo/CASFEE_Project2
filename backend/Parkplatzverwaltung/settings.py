from pathlib import Path
import datetime

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-3atbfptp&m=)#2p482^so%4gc!l_-97n1z!@$dd39(@axu*(2^'
DEBUG = True

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:4200',
    'http://localhost:4200',
]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
# ]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_jwt',
    'corsheaders',
    'django_filters',
    'api.apps.ApiConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'Parkplatzverwaltung.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Parkplatzverwaltung.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.postgresql_psycopg2',
        'HOST':     'tai.db.elephantsql.com',
        'NAME':     'cvxpvwab',
        'USER':     'cvxpvwab',
        'PASSWORD': 'h0ZpU_iEYFZk9PaaeVEVE6_BVCYuOQxF',
        'PORT':     ''
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (                                                     # Verify permission (roles) by this Class as default
        'rest_framework.permissions.IsAuthenticated',                                   # NOTE: This is the default-value and Views can disable this default using
        'api.permissions.KeycloakRolePermissions',                                      # permission_classes=[] (Class Based Views) and @permission_classes([]) (Function Based Views)
        # 'rest_framework.permissions.AllowAny',                                         # ---> can be use to run without OAuth 2.0
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (                                                 # Verify jwt-token in Header of each request as default
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',                 # NOTE: This is the default-value and Views can disable this default using  
        'rest_framework.authentication.SessionAuthentication',                          #   authentication_classes=[] (Class Based Views) and @authentication_classes([]) (Function Based Views)
        'rest_framework.authentication.BasicAuthentication',                            
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 30,
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'MAXCALLS': 500,
    'MAXCALLSPERIOD': 60
}

def jwt_get_username_from_payload_handler(payload):
    return 'api'

JWT_AUTH = {
    'JWT_PAYLOAD_GET_USERNAME_HANDLER': jwt_get_username_from_payload_handler,
    'JWT_SECRET_KEY': 'cf917505-8dcd-45bd-a9a6-23df484d838c',
    'JWT_GET_USER_SECRET_KEY': None,                                            # Not used                                      
    'JWT_PUBLIC_KEY': '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkry2sJHPG1L8mnBo5NIQMvZhTxj2NuRZO8Lx9sjsfOWihSo2Jx7z5bqBnMs3ggYogdJUpYjq4En/sER1GVVFTxfSR6ai3DFQDa5AM8ZZjt8V+jKSz6tCMra5LMkjVYJ1KaJJcORnnQGazLbeemZrp0gCasmI184Q3JX95WDzevHNK5fVGeyT2E1hYrHErAxxsD1aZIZ9/CLSmhcfvNhLUtoiDoVQaMYfTH0nEv/Unfvj0ywhdySN4HY1pLl4XH5m0alroO5sdKNYFLRLSSVkBAePaSK9Fm2hsO2Xb/azozG1ed8FhRaVoBfeOWZ7tV/Zjn/bklLYvEJi2LXs7JGDsQIDAQAB\n-----END PUBLIC KEY-----',
    'JWT_PRIVATE_KEY': None,
    'JWT_ALGORITHM': 'RS256',
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LEEWAY': 0,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=300),
    'JWT_AUDIENCE': 'Parkplatzverwaltung',                                                      # = Value out of Keycloak: Realm (EBP) -> Clients Scopes (ebp-audience) -> Mappers (ebp audience mapper)  
                                                                                #                                            |-->  Add this to Clients (ebp) ->  Client Scopes  
                                                                                #   NOTE: Is also used to get roles of jwt-payload in Permission-Classes ('permissions.py')
    'JWT_ISSUER': 'https://login-staging.optimatik.ch/auth/realms/HK%20CAS%20FEE',
    'JWT_ALLOW_REFRESH': False,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),

    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    'JWT_AUTH_COOKIE': None,
}

KEYCLOAK = {
    'REALM_NAME' : 'HK%20CAS%20FEE',
    'HOST' : 'https://login-staging.optimatik.ch',
    'CLIENT_ID': 'Parkplatzverwaltung',
    'PERMISSION_MAPPING' : {
        'user' :  ['GET', 'POST', 'PUT'],          
        'admin' : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'de-CH'
USE_I18N = True
USE_L10N = True
USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/
STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
