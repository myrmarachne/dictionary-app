import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordManager } from '../service/word-manager';
import { WordTranslationManager } from '../service/word-translation-manager';
import { AppState } from '../service/app-state';
import { Category } from '../model/category';
import { Word } from '../model/word';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public category: Category;
  public words: Word[];
  public wordsTranslationsMapping: any = {};

  constructor(
    private route: ActivatedRoute,
    private wordManager: WordManager,
    private wordTranslationManager: WordTranslationManager,
    private appState: AppState
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      this.category = this.appState.categories.filter(c => c.id === categoryId)[0];
      this.words = [];
      if (this.category) {
        this.wordManager.getAllForCategory(this.category)
          .then(words => this.words = words)
          .then(words =>
            Promise.all(words.map(word => this.wordTranslationManager.getAllForWord(word)))
              .then(wordsTranslations => {
                const translationsMapping = {};
                words.forEach((word, index) => translationsMapping[word.id] = wordsTranslations[index]);
                this.wordsTranslationsMapping = translationsMapping;
              })
          );
      }
    });
  }
}
