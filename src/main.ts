import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule);

// Para configurações de bootstrap da aplicação, alterar o arquivo main.hmr.ts
// Essa configuração só é utilizada para gerar documentação com o compodoc
