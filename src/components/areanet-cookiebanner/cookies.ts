export class Cookies{
    
    delete(name){
        var expired = new Date();
        expired.setFullYear(expired.getFullYear() - 100);
        document.cookie = name + "=true; expires=" + expired.toUTCString();
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
    
    set(name, lax = true){
        var expired = new Date();
        expired.setFullYear(expired.getFullYear() + 100);
        document.cookie = name + "=true; expires=" + expired.toUTCString() + (lax ? '; SameSite=Lax' : '');
    }

}