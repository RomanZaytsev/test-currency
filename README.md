Веб-приложение для подсчета суммы корзины в разных валютах.
На фронтенде имеется <a href="/cart">корзина</a>, в которую можно добавлять товары, которые имеют поля:
    name - строка,
    quantity - целое положительное число,
    currency - селект с опциями RUB, USD, EUR,
    price - положительное число

По нажатию на кнопку "Посчитать" товары отправляются на сервер, с которого, в формате JSON, приходит ответ, содержащий сумму цен товаров отображенную в разных валютах.
Пример ответа: {
    "RUB": 102,
    "EUR": 1.37,
    "USD": 1.55
}
