let faker = require('faker');

console.log(`===================
Welcome to my Shop!
===================`)

for (let i = 0, itemCount = 10; i < itemCount; i++) {
    let randomProduct = faker.commerce.product(),
        randomPrice = faker.commerce.price(),
        randomProductMaterial = faker.commerce.productMaterial(),
        randomProductAdj = faker.commerce.productAdjective();
    
    console.log(`${randomProductAdj} ${randomProductMaterial} ${randomProduct} - Price: $${randomPrice}`);
}