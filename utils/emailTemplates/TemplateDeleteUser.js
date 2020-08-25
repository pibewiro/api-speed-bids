function deleteProfileEmail(firstname, lastname) {
  const email = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
      }
  
      h1 {
        padding: 20px 0;
        text-align: center;
        font-weight: 100;
        font-size: 40px;
        background: #29303b;
        color: #fff;
      }
  
      p, a {
        line-height: 2em;
        margin-left: 10px;
      }
  
      img {
        display: block;
        margin: 20px auto;
        height: 75px;
        width: 75px;
      }
    </style>
  </head>
  
  <body>
    <div>
      <h1>SpeedBuyer</h1>
      <img src="cid:unique@kreata.ee"/>      
      <p>Obrigado, ${firstname} ${lastname}</p>
      <p>Por usar nosso serviço</p>
      <a href="http://localhost:8080">SpeedBuyer</a>
    </div>
  </body>
  
  </html>
  
  
  
  `;

  return email;
}

module.exports = deleteProfileEmail;
