import json
import jwt
import base64
import requests

from django.conf import settings
from rest_framework import permissions
from rest_framework import authentication
from rest_framework import exceptions
from rest_framework_jwt import authentication
from api import models

class KeycloakRolePermissions(permissions.BasePermission):

    def has_permission(self, request, view):
        #region (A) Get jwt out of http-header... 
        # ------------------------------------------
        try:
            # Raise an Error if 'HTTP_AUTHORIZATION' not exist (jwt-token not exist!) or ...
            jwt_token = request.META['HTTP_AUTHORIZATION']  

        except KeyError as ex:
            # This Code SHOULD never be reached, if by default the 'rest_framework.permissions.IsAuthenticated'-Class is set in front
            # of this Class in the settings ('settings.py') of REST_FRAMEWORK.DEFAULT_PERMISSION_CLASSES()!  
            # Read the comment in setting-file 'settings.py' near REST_FRAMEWORK-settings.
            message = {    
                "error": ".PermissionDenied", \
                "message": "This is a security-issue of miss-configuration! No 'HTTP_AUTHORIZATION'-header and therefore no jwt-token found! This exception prevents to a security vulnerability. Check comments in code of this class and Django-Rest-Framwork-settings in 'settings.py'.", \
                "exception": {   
                    "type": str(ex.__class__.__name__), \
                    "message": str(ex) \
                } \
            } 
            raise exceptions.PermissionDenied(detail=message)
        except Exception as ex:
            message = {    
                "error": "ebp.permissions.KeycloakRolePermissions.PermissionDenied", \
                "message": "An exception is raised by reading 'HTTP_AUTHORIZATION'-header! Debug code.", \
                "exception": {   
                    "type": str(ex.__class__.__name__), \
                    "message": str(ex) \
                } \
            } 
            raise exceptions.PermissionDenied(detail=message)

        #region (B) Get payload of jwt-token... 
        # ------------------------------------------
        try:
            # A jwt-token in format 'Bearer eyJ...dBw' is expected! 
            payload = jwt_token.split(".")[1]                   # Split jwt-token to array by splitting ' ' and grap second item:  'Bearer eyJ...dBw'
                                                                #                                                                   ------ ---------
                                                                #                                                                     [0]     [1]
            payload = payload + '=' * (-len(payload) % 4)       # Add paddings. A base64 have to contain a length of % 4
                                                                # see https://en.wikipedia.org/wiki/Base64#Output_padding
            payload = base64.b64decode(payload)                 # Decode with added paddings
            payload = payload.decode("utf-8")                   # byte(string) to string. Example: b'...' to '' 
            payload = json.loads(payload)                       # Convert to json-object

        except Exception as ex:
            message = {    
                "error": "ebp.permissions.KeycloakRolePermissions.PermissionDenied", \
                "message": "An exception is raised by extracting payload out of jwt-token! Note: A jwt-token by format 'Bearer eyJ...dBw' is expected. Debug code.", \
                "exception": {   
                    "type": str(ex.__class__.__name__), \
                    "message": str(ex) \
                } \
            } 
            raise exceptions.PermissionDenied(detail=message)

        #region (C) Get metadata out of payload... 
        try:
            client_id = settings.KEYCLOAK['CLIENT_ID']
            roles = payload['resource_access'][client_id]['roles']
            request.user.isAdmin = ('admin' in roles) if True else False
            request.user.keycloak_user_id = payload['sub']            

        except Exception as ex:
            message = {    
                "error": "ebp.permissions.KeycloakRolePermissions.PermissionDenied", \
                "message": "An exception is raised by extracing metadata out of payload of jwt-token found in 'HTTP_AUTHORIZATION'-header of request! Note: A structure 'resouce_access.[JWT_AUTH.JWT_AUDIENCE].roles', 'is-e.ID_Subjekt' and 'sub' is expected in token. Debug token and configuration of Keycloak.", \
                "exception": {   
                    "type": str(ex.__class__.__name__), \
                    "message": str(ex) \
                } \
            } 
            raise exceptions.PermissionDenied(detail=message)

        #region (D) Get permissions out of 'settings.py'.. 
        try:
            # Retrieve permissions of roles out of 'settings.py' additive...
            permissions = []
            for role in roles:
                permissions = permissions + settings.KEYCLOAK['PERMISSION_MAPPING'][role]    # Example: {
                                                                                                #            'user' :  ['GET'] ,          
                                                                                                #            'admin' : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                                                                                                #          }
                                                                                                # |-> permissions = ['GET', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
            # Remove dupplicates
            permissions = list(set(permissions))                                                # permissions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

        except Exception as ex:
            message = {    
                "error": "ebp.permissions.KeycloakRolePermissions.PermissionDenied", \
                "message": "An exception is raised by getting role-permissions from setting-parameter 'KEYCLOAK['PERMISSION_MAPPING']'. Do each roles found in acces_token (jwt) match to a configured role in settings? Check exception-details and debug code.", \
                "exception": {   
                    "type": str(ex.__class__.__name__), \
                    "message": str(ex) \
                } \
            } 
            raise exceptions.PermissionDenied(detail=message)

        #region (E) Test request...
        if request.method in permissions:
            return True # Allow request!
        else:            
            message = {    
                "type": "ebp.permissions.KeycloakRolePermissions.PermissionDenied", \
                "message": "Not allowed. This http request method ("+request.method+") is for authenticated users generally not allowed! You need higher privileges to execute this request.", \
            } 
            raise permissions.exceptions.PermissionDenied(detail=message)


        # For completeness and safety, if no permission is 
        # found and never a exception is raised:
        return False
    
    #region has_object_permission()
    def has_object_permission(self, request, view, obj):
        # No Object-Based permissions intended/planned.
        return self.has_permission(request, view)

#region KeycloakIsAdminPermission()

#region Descrition:
class KeycloakIsAdminPermission(permissions.BasePermission):

    #region has_permission()
    def has_permission(self, request, view):
        try: 
            if request.user.isAdmin:
                return True
            else:
                raise permissions.exceptions.PermissionDenied()

        except permissions.exceptions.PermissionDenied as ex:
            message = {    
                "type": "ebp.permissions.KeycloakIsAdminPermission.PermissionDenied", \
                "message": "Not allowed. Admin-role in claim 'resource_access." + settings.KEYCLOAK['CLIENT_ID']+".roles[]' of access_token not found! You need to be an administrator to execute this request.", \
            } 
            raise exceptions.PermissionDenied(detail=message)            
        
        except Exception as ex:
            message = {    
                "error": "epb.permissions.KeycloakIsAdminPermission.PermissionDenied", \
                "message": "An exception is raised by testing permission admin-role.", \
                "exception": {   
                    "type": str(ex.__class__.__name__), \
                    "message": str(ex) \
                } \
            } 
            raise exceptions.PermissionDenied(detail=message)    

        return False # By default if this code is reached... (Should Normaly never be reached!)  

    #region has_object_permission()
    def has_object_permission(self, request, view, obj):
        # No Object-Based permissions intended/planned.
        return self.has_permission(request, view)
