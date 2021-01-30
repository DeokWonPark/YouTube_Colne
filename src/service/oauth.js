class OAuth{
    constructor(clientId){
        this.clientId=clientId;
    }

    oauthSignIn=()=> {
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      
        const form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);
        const scope="https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner"
    
        const params = {'client_id': this.clientId,
                      'redirect_uri': 'https://deokwonpark.github.io/YouTube_Colne/',
                      'response_type': 'token',
                      'scope': scope,
                      'include_granted_scopes': 'true',
                      'state': 'pass-through value'};
      
        for (let p in params) {
          const input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', p);
          input.setAttribute('value', params[p]);
          form.appendChild(input);
        }
      
        document.body.appendChild(form);
        form.submit();
    }

    oauthSignOut(auth){
        const revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';
    
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', revokeTokenEndpoint);
    
        const tokenField = document.createElement('input');
        tokenField.setAttribute('type', 'hidden');
        tokenField.setAttribute('name', 'token');
        tokenField.setAttribute('value', auth);
        form.appendChild(tokenField);
    
        document.body.appendChild(form);
        form.submit();
    }
}

export default OAuth;