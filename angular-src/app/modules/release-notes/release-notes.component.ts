
import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'release-notes',
    moduleId: module.id,
    templateUrl: 'release-notes.component.html'
})
export class ReleaseNotesComponent {
    path: string;
    constructor(private router: Router) {
    }

    ngOnInit() {
        this.path = 'static/ReleaseNotes.md';
    }
}