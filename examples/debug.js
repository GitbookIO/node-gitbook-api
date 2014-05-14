module.exports = function(p) {
    return p.then(function(ret) {
        console.log("return: ", ret);
    }, function(err) {
        console.log("error: ", err.stack || err.message || err);
    });
};
