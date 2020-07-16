export class CookieService{
    
    delete(name, domain = null, path = null){
        var expired = new Date();
        expired.setFullYear(expired.getFullYear() - 100);

        var deleteC = name + "=; expires=" + expired.toUTCString() + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');
        document.cookie = deleteC;
    }

    get(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
    
        for(var i=0;i < ca.length;i++) {
            
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    set(name, value : any = true, isTemp = false){
        var expired = null;

        if(isTemp){
            var current = new Date();
            expired = new Date(current.getTime() + 2*60000);
        }else{
            expired = new Date();
            expired.setFullYear(expired.getFullYear() + 2);
        }
        
        document.cookie = name + "=" + value + "; expires=" + expired.toUTCString()+'; secure; SameSite=strict';
    }

}