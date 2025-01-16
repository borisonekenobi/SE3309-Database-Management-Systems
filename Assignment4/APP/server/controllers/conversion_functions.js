const {randomBytes, createHash} = require("crypto");

function hash(string, salt = randomBytes(32).toString('hex')) {
    return [createHash('sha256').update(salt + string).digest('hex'), salt];
}

module.exports = {
    hash
};
