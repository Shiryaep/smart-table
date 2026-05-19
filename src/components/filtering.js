export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        }),
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // код с обработкой очистки поля

    // @todo: #4.5 — отфильтровать данные, используя компаратор
    const filter = {};
    if (!elements || typeof elements !== 'object') {
      return query;
    }
    Object.keys(elements).forEach((key) => {
      const element = elements[key];
      if (!element) return;
      const tagName = element.tagName;
      if (!["INPUT", "SELECT"].includes(tagName)) return;
      const value = element.value;
      if (!value) return;
      const name = element.name;
      if (!name) return;
      // ищем поля ввода в фильтре с непустыми данными
      filter[`filter[${name}]`] = value; // чтобы сформировать в query вложенный объект фильтра
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
