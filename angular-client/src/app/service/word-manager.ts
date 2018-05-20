import {Injectable} from '@angular/core';
import {Category} from '../model/category';
import {Word} from '../model/word';
import Configuration from '../configuration';
import {Http} from '@angular/http';

@Injectable()
export class WordManager {
  constructor(private http: Http) {}

  getAllForCategory(category: Category): Promise<Word[]> {
    return this.getAllUsingIds(category.words);
  }

  getHardWords(limit): Promise<Word[]> {
    return this.http.get(Configuration.backendUrl + '/words?type=hard&limit=' + limit)
      .toPromise()
      .then(response => response.json() as number[])
      .then(ids => this.getAllUsingIds(ids));
  }

  getLastWords(limit): Promise<Word[]> {
    return this.http.get(Configuration.backendUrl + '/words?type=last&limit=' + limit)
      .toPromise()
      .then(response => response.json() as number[])
      .then(ids => this.getAllUsingIds(ids));
  }

  getAllUsingIds(ids: number[]): Promise<Word[]> {
    return Promise.all(ids.map(id =>
      this.http.get(Configuration.backendUrl + '/words/' + id)
        .toPromise()
        .then(response => response.json())
    ));
  }

  getById(id: number): Promise<Word> {
    return this.getAllUsingIds([id])
      .then(words => words[0]);
  }

  create(word: Word): Promise<Word> {
    return this.http.post(Configuration.backendUrl + '/words', word)
      .toPromise()
      .then(response => response.json());
  }

  update(word: Word): Promise<Word> {
    return this.http.put(Configuration.backendUrl + '/words/' + word.id, word)
      .toPromise()
      .then(response => response.json());
  }

  delete(word: Word): Promise<void> {
    return this.http.delete(Configuration.backendUrl + '/words/' + word.id)
      .toPromise()
      .then(response => null);
  }
}
