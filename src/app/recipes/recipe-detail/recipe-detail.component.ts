import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map, mergeMap} from "rxjs/operators";
import * as RecipesActions from "../store/recipe.actions"
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions"


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  subscription: Subscription;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(
        map(params => {
          return +params['id']
        }),
        mergeMap(id => {
          this.id = id;
          return this.store.select("recipes")
        }),
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => index === this.id);
        })
      ).subscribe(recipe => {
        this.recipe = recipe;
      })
  }


  onAddingIngredients() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['../'], {relativeTo: this.route}).then();
  }

}
