import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CategoryManager } from './service/category-manager';
import { WordManager } from './service/word-manager';
import { WordTranslationManager } from './service/word-translation-manager';
import { AppState } from './service/app-state';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routes';
import { WordComponent } from './word/word.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    HomeComponent,
    WordComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    routing
  ],
  providers: [
    CategoryManager,
    WordManager,
    WordTranslationManager,
    AppState,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
