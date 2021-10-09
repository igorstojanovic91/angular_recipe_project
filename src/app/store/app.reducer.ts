import * as fromShoppinList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import {ActionReducerMap} from "@ngrx/store";


export interface AppState {
  shoppingList: fromShoppinList.ShoppingListState,
  auth: fromAuth.AuthState
}


export const appRedcuer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppinList.shoppingListReducer,
  auth: fromAuth.authReducer
}
