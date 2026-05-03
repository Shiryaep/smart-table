import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // Создаем компаратор с правилом skipEmptyTargetValues и правилом поиска по нескольким полям
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // Применяем компаратор для фильтрации данных
        return data.filter((row) => compare(row, state));
    }
}