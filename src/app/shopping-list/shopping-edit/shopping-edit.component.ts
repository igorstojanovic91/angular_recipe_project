import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListAction from "../store/shopping-list.actions";
import {AppState} from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItem: Ingredient;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(
      stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editItem.name,
            amount: this.editItem.amount
          });
        } else {
          this.editMode = false;
        }

      }
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);
    this.editMode
      ? this.store.dispatch(new ShoppingListAction.UpdateIngredient({
        newIngredient: ingredient
      }))
      : this.store.dispatch(new ShoppingListAction.AddIngredient(ingredient));
    this.resetForm();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListAction.DeleteIngredient())
    this.resetForm()
  }

  resetForm() {
    this.editMode = false;
    this.slForm.reset();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }


}
