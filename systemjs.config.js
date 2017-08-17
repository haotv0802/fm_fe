/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      // Toaster
      'angular2-toaster': 'npm:angular2-toaster/bundles/angular2-toaster.umd.js',
      // Modal
      'angular2-modal': 'npm:angular2-modal',
      'angular2-modal/plugins/bootstrap': 'npm:angular2-modal/bundles',
      // Smart-Table
      'ng2-completer':'npm:ng2-completer',
      'ng2-smart-table':'npm:ng2-smart-table',
      'lodash':'npm:lodash',
      'traceur':'npm:traceur/bin/traceur.js',
      // other libraries
      'rxjs': 'npm:rxjs',
      'ngx-mydatepicker': 'npm:ngx-mydatepicker/bundles/ngx-mydatepicker.umd.min.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular2-modal': {
        main: 'bundles/angular2-modal.umd',
        defaultExtension: 'js'
      },
      "angular2-modal/plugins/bootstrap": {
        main: 'angular2-modal.bootstrap.umd',
        defaultExtension: 'js'
      },
      lodash: {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'ng2-completer': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'ng2-smart-table': {
        main: 'index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);