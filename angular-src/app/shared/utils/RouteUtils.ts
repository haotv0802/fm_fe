import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { isEmpty } from './index';

/**
 * Extract all url query parameters
 * return a js object like {x:11, y:22, z:[33, 44, 55]}
 * 
 * @param route 
 * @param defaultParams 
 */
function extractParams(route: ActivatedRoute, defaultParams?: object) {
    let params = defaultParams ? defaultParams : {};
    route.queryParamMap.subscribe(p => {
        p.keys.forEach((key) => {
            let vals = p.getAll(key);
            params[key] = vals.length > 1 ? vals : vals.length > 0 ? vals[0] : null;
        });
    });
    return params;
}

/**
 * navigate to a component
 * 
 * param: {x:11, y:22, z:[33, 44, 55]}
 * url: page-a
 * => /page-a?x=11&y=22&z=33&z=44&z=55
 * 
 * @param router 
 * @param url 
 * @param params
 */
function navigateTo(router: Router, url: string, params: object, reload?: boolean) {
    let queryParams = {};
    for (let prop in params) {
        if (params.hasOwnProperty(prop) && !isEmpty(params[prop])) {
            queryParams[prop] = params[prop];
        }
    }

    let navigationExtras: NavigationExtras = {
        queryParams: queryParams
    };

    router.navigate([url], navigationExtras).then(result=>{
        if (reload && result === null) {
            navigateTo(router, url, {...params, _refresh: router['navigationId']}, reload);
        }
    });
}

const NAVIGATIONS_HISTORY = {};
function subscribeNavigationEnd(router: Router, rootUrl: string, callback: Function) {
    let subscriber = router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
        let urls = event['url'].split('?');
        if(urls.length && urls[0] === rootUrl
            && (NAVIGATIONS_HISTORY[rootUrl] === undefined
                || NAVIGATIONS_HISTORY[rootUrl] !== event['id'])) {

            NAVIGATIONS_HISTORY[rootUrl] = event['id'];
            callback(event);

        } else {
            NAVIGATIONS_HISTORY[rootUrl] = event['id'];
        }
    });

    // handle reload page
    /*if (Object.keys(NAVIGATIONS_HISTORY).length === 0) {
        //NAVIGATIONS_HISTORY[rootUrl] = 0;
        callback(new NavigationEnd(0, router.url, router.url));
    }*/
    //reload page or component
    NAVIGATIONS_HISTORY[rootUrl] = 0;
    callback(new NavigationEnd(0, router.url, router.url));

    return subscriber;
}

export default {
    extractParams,
    navigateTo,
    subscribeNavigationEnd
};