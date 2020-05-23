import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { StateKey, makeStateKey, TransferState } from "@angular/platform-browser";
import { isPlatformServer } from "@angular/common";

@Injectable()
export class CustomHttpClientService {

  constructor(
    private httpClient: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    const transferKey: StateKey<T> = makeStateKey(`${path}?${params != null ? params.toString() : ""}`);
    
    if (this.transferState.hasKey(transferKey)) {
      return of(this.transferState.get<any>(transferKey, 0))
        .pipe(
          tap(() => this.transferState.remove(transferKey))
        );
    } else {
      return this.httpClient.get<T>(path, { observe: "body", responseType: "json", params: params })
        .pipe(
          tap(response => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set<T>(transferKey, response);
            }
          })
        );
    }
  }
}