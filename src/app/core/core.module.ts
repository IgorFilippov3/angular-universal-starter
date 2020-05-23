import { NgModule } from "@angular/core";
import { CustomHttpClientService } from "src/app/core/custom-http-client.service";
import { HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { CookiesInterceptor } from "src/app/core/cookies.interceptor";

@NgModule({
  imports: [HttpClientModule],
  providers: [
    CustomHttpClientService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CookiesInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule {}