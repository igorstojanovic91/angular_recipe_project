import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput')
  nameInputRef: ElementRef;
  @ViewChild('amountInput')
  amountInputRef: ElementRef;


  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
  }

  onAddItem() {
    const nameInput = this.nameInputRef.nativeElement.value;
    const amountInput = this.amountInputRef.nativeElement.value;
    const ingredient = new Ingredient(nameInput, amountInput);
    this.shoppingListService.addIngredient(ingredient);
  }

}
