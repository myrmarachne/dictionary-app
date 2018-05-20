import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordManager } from '../service/word-manager';
import { WordTranslationManager } from '../service/word-translation-manager';
import { AppState } from '../service/app-state';
import { Category } from '../model/category';
import { Word } from '../model/word';
import { WordTranslation } from '../model/word-translation';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {
  public word: Word;
  public wordCategories: Category[];
  public wordTranslations: WordTranslation[];

  constructor(
    private route: ActivatedRoute,
    private wordManager: WordManager,
    private wordTranslationManager: WordTranslationManager,
    private appState: AppState
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const wordId = +params['wordId'];
      this.word = null;
      this.wordCategories = [];
      this.wordTranslations = [];
      this.wordManager.getById(wordId).then((word) => {
        this.word = word;
        this.wordCategories = this.appState.categories
          .filter(category => word.categories.indexOf(category.id) !== -1);
        this.wordTranslationManager.getAllForWord(word)
          .then(translations => this.wordTranslations = translations);
      });
    });
  }
}
