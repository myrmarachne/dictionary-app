import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { WordComponent } from './word/word.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'category/:categoryId', component: CategoryComponent },
  { path: 'word/:wordId', component: WordComponent },
  { path: '**', redirectTo: 'home' },
];

export const routing = RouterModule.forRoot(routes);
