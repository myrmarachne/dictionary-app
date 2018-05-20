import {Injectable} from '@angular/core';
import {Category} from '../model/category';

@Injectable()
export class AppState {
  categories: Category[];
}
