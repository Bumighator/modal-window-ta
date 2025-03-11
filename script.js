const productTemplate = (index) => {
  return `
    <li class="product">
      <div class="heading">
        <h3 class="color-accent">Товар <span class="productIndex color-accent">${index + 1}</span></h3>
        <button class="removeProduct" type="button" title="Удалить товар из списка"></button>
      </div>
      <label class="inputField">
        <div class="fieldWrapper">
          <div class="fieldName">
            <p class="font-xs">Название товара</p>
          </div>
          <input value="Футболка" class="font-primary medium" placeholder="Значение..." />
        </div>
      </label>
      <p class="productLine font-sm medium">Скорее всего, это <span class="color-accent">линия "Одежда"</span></p>
      <div class="transportData">
        <h4 class="font-primary semibold">Введите транспортировочные данные</h4>
        <div class="fieldRow">
          <label class="inputField">
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Длинна, см</p>
              </div>
              <input name="length" id="length-${index}" class="fieldDimensions font-primary medium" placeholder="Длина" />
            </div>
          </label>
          <label class="inputField">
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Ширина, см</p>
              </div>
              <input name="width" id="width-${index}" class="fieldDimensions font-primary medium" placeholder="Ширина" />
            </div>
          </label>
          <label class="inputField">
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Высота, см</p>
              </div>
              <input name="height" id="height-${index}" class="fieldDimensions font-primary medium" placeholder="Высота" />
            </div>
          </label>
          <label class="inputField">
            <p class="font-xs medium">или</p>
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Введите объём</p>
              </div>
              <input name="volume" id="volume-${index}" class="fieldDimensions volumeField font-primary medium" placeholder="Объём" readonly disabled/>
            </div>
          </label>
        </div>
        <div class="fields">
          <label class="inputField">
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Вес коробки, кг</p>
              </div>
              <input class="full-width font-primary medium" placeholder="Введите вес коробки" />
            </div>
          </label>
          <label class="inputField">
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Кол-во коробок, шт</p>
              </div>
              <input class="full-width font-primary medium" placeholder="Введите кол-во оробок" />
            </div>
          </label>
          <label class="inputField">
            <div class="fieldWrapper">
              <div class="fieldName">
                <p class="font-xs">Cтоимость товара, $</p>
              </div>
              <input class="full-width font-primary medium" placeholder="Введите общую стоимость всего товара" />
            </div>
          </label>
        </div>
        <div class="checkbox">
          <input id="checkbox-${index}" type="checkbox" />
          <label for="checkbox-${index}">
            <div><img alt="Checkmark icon" src="icons/check.svg"/></div>
            <span>Хрупкий товар</span>
          </label>
        </div>
      </div>
    </li>
  `
}

const bubbleTemplate = (name, id) => {
  return `
    <li class="font-primary medium color-accent">
      ${name}
      <button id="bubble-${id}" class="removeBubble" data-id="${id}" type="button" title="Убрать вариант"></button>
    </li>
  `
}

toastr.options = {
  "positionClass": "toast-bottom-right",
  "innerHtml": `
    <div class="notification">
      <h4 class="font-primary semibold">${status}</h4>
      <p class="font-xs">${message}</p>
    </div>
  `
}

function toggleModal(extra) {
  const modal = $(".modalWrapper") 
  const html = $("html")

  let isOpen = modal.hasClass("closed")
  modal.toggleClass("closed")
  
  if (isOpen) html.css("overflow-y", 'hidden')
  else html.css("overflow-y", 'auto')

  // Симулируем деятельность кнопки "сохранить расчёт"
  if (extra) $.toast({
    heading: "Успех!",
    text: "Расчёт сохранён",
    bgColor: "#FFFFFF",
    textColor: "#3D3D3D",
    loader: false,
    position: "bottom-right"
  })
}

const list = $(".productList")
const addButton = $("button.addProduct")

function addProduct() {
  list.append(productTemplate(
    $(".productList li").length
  ))
}

function removeProduct(thisElement) {
  thisElement.parents().eq(1).remove()
}

function adjustIndexes(deletedIndex) {
  // Подстраиваем индексы полей под индекс позиции, относительно древа DOM
  function adjustFieldIndex(name) {
    $(`#${name}-${deletedIndex + 1}`).prop("id", `${name}-${deletedIndex + 1}`)
  }

  adjustFieldIndex('length')
  adjustFieldIndex('width')
  adjustFieldIndex('height')
  adjustFieldIndex('volume')
  adjustFieldIndex('checkbox')

  $(`#checkbox-${deletedIndex + 1}`).prop("for", `checkbox-${deletedIndex + 1}`)
  // Убрать из комментария строчку ниже, если требуется последовательное нумервоание товаров
  // $('.product').eq(deletedIndex).find('span.productIndex').text(deletedIndex + 1)
}

function calculateRowValues(index) {
  // Получаем значение полей ДхШхВ или 1, если поле пустое или введены неверные данные
  const length = parseInt($(`input#length-${index}`).val()) || 1
  const width = parseInt($(`input#width-${index}`).val()) || 1
  const height = parseInt($(`input#height-${index}`).val()) || 1

  // Высчитываем получившийся объём товара
  const volume = length * width * height

  // Присваеваем получившийся объём полю "объём"
  $(`input#volume-${index}`).val(volume || 0)
  
  // Высчитываем сумму полей "объём" по всем товарам
  let sum = 0

  for (i = 0; i < $(".volumeField").length; i++) {
    sum += parseInt($(".volumeField").eq(i).val())
  }
  
  // Записываем получившуюся сумму в поле
  $(`input[name="volume-sum"]`).val(sum)
}

function toggleSelect() {
  $(".selectContent").toggleClass("closed")
  $(".dropdownArrow").toggleClass("select-closed")
}

const bubbles = $('.bubbles')

function addBubble(name, id) {
  bubbles.append(bubbleTemplate(name, id))
}

function removeBubble(thisElement, id) {
  thisElement.parent().remove()
  $(`input[id="${id}"]`).prop("checked", false)
}

// EventListener'ы
$(document).ready(() => {
  // Добавляем один товар в список при загрузке страницы
  addProduct()
  // Функционал добавления товара
  addButton.on("click", addProduct)
  // Удаление товара
  $(document).on("click", "button.removeProduct", function() {
    // Если товар один, убираем возможность его удаления из списка
    if ($(".productList li").length > 1) {
      const deletedIndex = $(this).parents().eq(1).index()

      // Удаляем товар из списка
      removeProduct($(this))
      // Перераспределяем айдишки на нужных полях
      adjustIndexes(deletedIndex)
      // Перерасчитываем сумму объёмов
      calculateRowValues(deletedIndex)
    }
  })
  // Рассчитываем объём во время ввода пользователем данных
  $(document).on("input", "input.fieldDimensions", function() {
    const index = $(this).parents().eq(4).index()

    calculateRowValues(index)
  })
  // Управление выбором упаковки
  $(".select-checkbox").change(function() {
    // Добавляем опцию под поле, если пункт выбран
    if (this.checked) addBubble(this.value, this.id)
    // Удаляем, если пункт отжат
    else $(`button[id="bubble-${this.id}"`).parent().remove()
  })
  // При удалении кружка с опцией отжимаем пункт в дропдауне
  $(document).on("click", "button.removeBubble", function() {
    removeBubble($(this), $(this).data("id"))
  })
})