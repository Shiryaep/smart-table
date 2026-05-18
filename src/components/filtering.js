import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      elements[elementName].append(
        // в каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
          .map((name) => {
            // используйте name как значение и текстовое содержимое
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            return option;
          }),
      );
    });

  return (data, state, action) => {
    console.log(action);

    // Подготовка состояния для фильтрации
    const prepareState = (rawState) => {
      // Создаём копию состояния
      const filteredState = { ...rawState };
      
      // Обрабатываем диапазон totalFrom/totalTo
      const totalFrom = rawState.totalFrom;
      const totalTo = rawState.totalTo;
      
      // Преобразуем в числа, если возможно
      const parseNumber = (val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      };
      
      const fromNum = parseNumber(totalFrom);
      const toNum = parseNumber(totalTo);
      
      // Если хотя бы одно значение задано, создаём массив диапазона
      if (fromNum !== null || toNum !== null) {
        filteredState.total = [fromNum, toNum];
      }
      
      // Удаляем исходные поля, чтобы они не мешали фильтрации
      delete filteredState.totalFrom;
      delete filteredState.totalTo;
      
      return filteredState;
    };

    // Если action отсутствует или не является объектом — сразу выполняем фильтрацию
    if (!action || typeof action !== "object") {
      const filteredState = prepareState(state);
      return data.filter((row) => compare(row, filteredState));
    }

    // Обрабатываем действие «clear»
    if (action.name === "clear") {
      const parentElement = action.parentNode;
      const inputField = parentElement.querySelector("input");

      if (inputField) {
        const fieldName = action.dataset.field;
        inputField.value = "";
        state[fieldName] = ""; // Обновляем соответствующее поле в state
      }
    }

    const filteredState = prepareState(state);
    return data.filter((row) => compare(row, filteredState));
  };
}
