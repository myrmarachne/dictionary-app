import {Injectable} from '@angular/core';
import {Word} from '../model/word';
import {WordTranslation} from '../model/word-translation';
import Configuration from '../configuration';
import {Http} from '@angular/http';

@Injectable()
export class WordTranslationManager {
  constructor(private http: Http) {}

  getAllForWord(word: Word): Promise<WordTranslation[]> {
    return this.getAllUsingIds(word.translations);
  }

  getAllUsingIds(ids: number[]): Promise<WordTranslation[]> {
    return Promise.all(ids.map(id =>
      this.http.get(Configuration.backendUrl + '/word-translations/' + id)
        .toPromise()
        .then(response => response.json())
    ));
  }

  create(translation: WordTranslation): Promise<WordTranslation> {
    return this.http.post(Configuration.backendUrl + '/word-translations', translation)
      .toPromise()
      .then(response => response.json());
  }

  update(translation: WordTranslation): Promise<WordTranslation> {
    return this.http.put(Configuration.backendUrl + '/word-translations/' + translation.id, translation)
      .toPromise()
      .then(response => response.json());
  }

  delete(translation: WordTranslation): Promise<void> {
    return this.http.delete(Configuration.backendUrl + '/word-translations/' + translation.id)
      .toPromise()
      .then(response => null);
  }
}
