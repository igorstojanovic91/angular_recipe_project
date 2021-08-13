import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          this.editItemIndex = index;
          this.editMode = true;
          this.editItem = this.shoppingListService.getIngredient(index);
          this.slForm.setValue({
            name: this.editItem.name,
            amount: this.editItem.amount
          });
        }
      )
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);
    this.editMode
      ? this.shoppingListService.updateIngredient(this.editItemIndex, ingredient)
      : this.shoppingListService.addIngredient(ingredient);
    this.resetForm();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.resetForm()
  }

  resetForm() {
    this.editMode = false;
    this.slForm.reset();
  }


}
