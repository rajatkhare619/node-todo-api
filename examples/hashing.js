const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let pass = "123abc!";

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pass, salt, (err, hash) => {
        console.log(hash);
    });
});
let h = "$2a$10$WNwWtbWsG62VawUYO6RPR.EM.4bl3eMmKmCIcqEaywsDojzwHX2oO";

bcrypt.compare("123abc!", h, (err, res) => {
    console.log(res);
});

/*let data = {
    id: 10
};

let token = jwt.sign(data, "123abc");
console.log("token", token);

let decoded = jwt.verify(token + 3, "123abc");
console.log("decoded", decoded);*/
/*
let message = "I am user number 33";
let hash = SHA256(message).toString();


let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + "somesecret").toString()
};

let resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

if (resultHash === token.hash) {
    console.log("data not changed");
    console.log("resultHash", resultHash);
    console.log("token.hash", token.hash );
} else {
    console.log("data changed");
    console.log("resultHash", resultHash);
    console.log("token.hash", token.hash );
}*/
