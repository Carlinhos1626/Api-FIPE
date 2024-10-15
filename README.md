# 🚗 API PLACA-FIPE

## Introdução:

Está api é para buscar dados de veículos a partir da placa. Ela também verifica se o valor pesquisada realmente é uma placa válida.

## Uso

### - Exemplo de consulta

```js
consultarPlaca({ placa: "KLX1653"})
  .then((resultado) => {
    console.log(resultado);
  })
  .catch((error) => {
    console.error(error);
  });
```