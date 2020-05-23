import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Optional, Inject, PLATFORM_ID, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";

@Injectable()
export class CookiesInterceptor implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject("INCOMING_REQUEST") private request: any
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformServer(this.platformId) && this.request) {
      const requestCookies = this.request.getCookies();
      
      if (requestCookies) {
        req = req.clone({setHeaders: {Cookie: requestCookies}});
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      req = req.clone({ withCredentials: true })
    }

    return next.handle(req);
  }
}