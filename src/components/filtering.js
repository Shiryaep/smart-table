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

    // Если action отсутствует или не является объектом — сразу выполняем фильтрацию
    if (!action || typeof action !== "object") {
      return data.filter((row) => compare(row, state));
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

    return data.filter((row) => compare(row, state));
  };
}
