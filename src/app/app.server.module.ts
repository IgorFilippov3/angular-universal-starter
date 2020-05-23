import { NgModule, Inject, Injectable } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { REQUEST } from "@nguniversal/express-engine/tokens";
import { Request } from "express";

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@Injectable()
export class IncomingServerRequest {
  constructor(@Inject(REQUEST) private request: Request) { }

  getCookies() {
    return !!this.request.headers.cookie ? this.request.headers.cookie : null;
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: "INCOMING_REQUEST", useClass: IncomingServerRequest },
  ]
})
export class AppServerModule { }
