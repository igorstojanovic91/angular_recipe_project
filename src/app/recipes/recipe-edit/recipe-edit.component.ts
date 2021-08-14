import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Recipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  currentRecipe: Recipe;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  get controls(): AbstractControl[] {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.editMode
          ? this.currentRecipe = this.recipeService.getRecipeById(this.id)
          : null;
        this.initForm();
      }
    )
  }

  initForm() {
    let recipeName = this.currentRecipe?.name || '';
    let imagePath = this.currentRecipe?.imagePath || '';
    let recipeDescription = this.currentRecipe?.description || '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      if (this.currentRecipe.ingredients) {
        for (let ingredient of this.currentRecipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount,
              [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, [Validators.required]),
      'imagePath': new FormControl(imagePath, [Validators.required]),
      'description': new FormControl(recipeDescription, [Validators.required]),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    this.editMode
      ? this.recipeService.updateRecipe(this.id, this.recipeForm.value)
      : this.recipeService.addRecipe(this.recipeForm.value);
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
