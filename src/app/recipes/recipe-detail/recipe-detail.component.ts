import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  idSubscription: Subscription;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.idSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          const id = +params['id']
          this.recipe = this.recipeService.getRecipeById(id);
        }
      )

  }

  onAddingIngredients() {
    this.recipeService.addIngredientsToShippingList(this.recipe.ingredients);
  }

  ngOnDestroy(): void {
    this.idSubscription.unsubscribe();
  }

}
