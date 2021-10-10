import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map} from "rxjs/operators";
import * as RecipesActions from "../store/recipe.actions"
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router,
              private store: Store<AppState>) {
  }

  ngOnDestroy(): void {
    if (this.storeSub)
      this.storeSub.unsubscribe();
  }

  get controls(): AbstractControl[] {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  initForm() {
    let recipeName = '';
    let imagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    this.storeSub = this.store.select("recipes").pipe(
      map(recipeState => recipeState.recipes.find((recipe, index) => index === this.id))
    ).subscribe(recipe => {
      recipeName = recipe.name;
      imagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (this.editMode) {
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount,
                [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }))
          }
        }
      }
    })

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, [Validators.required]),
      'imagePath': new FormControl(imagePath, [Validators.required]),
      'description': new FormControl(recipeDescription, [Validators.required]),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    this.editMode
      ? this.store.dispatch(
        new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value})
      )
      : this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))

    this.navigateToRecipeDetail();
  }

  onCancel() {
    this.recipeForm.reset();
    this.navigateToRecipeDetail()
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }


  navigateToRecipeDetail() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }


}
