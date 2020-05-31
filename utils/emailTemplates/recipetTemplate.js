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
      }
  
      span {
        font-weight: bold;
      }
  
      .product-info {
        line-height: 2em;
        width: 50%;
        margin: 10px auto;
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
      <h1>Purchase Reciept</h1>
      <div class="img-div">
        <img src="logo.png" alt="">
      </div>
      <div class="product-info">
        <p><span>Product Code:</span> #${data.id}</p>
        <p><span>Product Name:</span> ${data.productName}</p>
        <p><span>Price:</span> R$${data.price}</p>
        <p><span>Sold By:</span> ${data.owner.firstname} ${data.owner.lastname}</p>
        <p><span>Sold To:</span> ${data.user.firstname} ${data.user.lastname}</p>
        <p><span>Date:</span> ${data.date}</p>
      </div>
  
    </div>
  </body>
  
  </html>
  `;
  return template;
}


module.exports = recieptTemplate;