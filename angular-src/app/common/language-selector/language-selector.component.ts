import { Component}   from '@angular/core';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'language-selector',
  templateUrl: 'language-selector.html'
})
export class LanguageSelectorComponent {
	public languages = ['en','ko'] ;
	public currentLanguage : string;
	
	constructor(public languageService : LanguageService){
		this.currentLanguage = this.languageService.getLanguage();
	}
	
	changeLanguage(){
		this.languageService.setLanguage(this.currentLanguage);
	}
}