function recieptTemplate(data) {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
      }
  
      h1 {
        text-align: center;
        font-weight: 100;
        padding: 10px;
        font-size:20px;
      }
  
      span {
        font-weight: bold;
      }
  
      .product-info {
        line-height: 2em;
        width: 50%;
        margin: 10px auto;
        font-size:10px;
      }


  
      .img-div {
        width: 100px;
        height: 100px;
        margin: 0 auto;
      }
  
      .img-div img {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  
  <body>
    <div>
      <h1>Recibo de Compra Speed Buyer</h1>
      <div class="img-div">
        <img src="logo.jpg" alt="">
      </div>
      <div class="product-info">
        <p><span>Codigo do Produto:</span> #${data.id}</p>
        <p><span>Nome do Produto:</span> ${data.productName}</p>
        <p><span>Preço:</span> R$${data.price}</p>
        <p><span>Vendido por:</span> ${data.owner.firstname} ${data.owner.lastname}</p>
        <p><span>Vendido a:</span> ${data.user.firstname} ${data.user.lastname}</p>
        <p><span>Data de Compra:</span> ${data.date}</p>
      </div>
  
    </div>
  </body>
  
  </html>
  `;
  return template;
}

module.exports = recieptTemplate;
