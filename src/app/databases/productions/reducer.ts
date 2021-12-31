import { State as I18nState } from '~/src/app/i18n';
import { ProductionsApi, Production } from '~/src/api';

import { initReducer, ReducerState as BaseReducerState, defaultPaginateFunction } from '../base/reducer';

export function displayRecipe(item: Production, t: (key: string) => string): string {
  return item.costs.map((c) => `${ t(`db.items.${ c.id }`) } x ${ c.count }`).join(', ');
}

export function displayProducedIn(item: Production, t: (key: string) => string): string {
  return item.producedIn.map((c) => t(`db.buildings.${ c }`)).join(', ');
}

export const reduxKey = 'productions';
const { selectors, fetch, slice } = initReducer<Production>(
  'databases/productions',
  reduxKey,
  ProductionsApi.fetchAll,
  (item, field, t) => {
    if (field === 'name') {
      return t(`db.items.${ item.itemId }`);
    } else if (field === 'recipe') return displayRecipe(item, t);
    else if (field === 'producedIn') return displayProducedIn(item, t);
    return defaultPaginateFunction(item, field, t);
  }
);

export interface ReducerState extends BaseReducerState<Production> {}

export interface State extends I18nState {
  items: ReducerState;
}

export { selectors, fetch };
export const { changeParams, reset } = slice.actions;
export default slice.reducer;

