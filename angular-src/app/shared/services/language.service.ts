import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';


@Injectable()
export class LanguageService {

    constructor(private translate: TranslateService, private cookieService: CookieService) {
        	
    }
    
    setLanguage(languageCode : string){
    	languageCode = /(en|ko)/gi.test(languageCode)? languageCode : 'ko';
    	this.cookieService.put('lang', languageCode);
    	this.translate.use(languageCode);
    }
    
    getLanguage() : string{
	    let userLang = this.cookieService.get('lang');
    	if(userLang == null){
        	navigator.language.split('-')[0]; 
	        userLang = /(en|ko)/gi.test(userLang) ? userLang : 'ko';
	        this.cookieService.put('lang', userLang);
        }
        this.translate.use(userLang);
        return userLang;
    }

}