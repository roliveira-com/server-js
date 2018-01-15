"use strict";
exports.__esModule = true;
var User = /** @class */ (function () {
    function User(email, name, password) {
        this.email = email;
        this.name = name;
        this.password = password;
    }
    User.prototype.matches = function (another) {
        return another !== undefined && another.email === this.email && another.password === this.password;
    };
    return User;
}());
exports.User = User;
;
// tipando constante 'users'
exports.users = {
    'ro@ro.com': new User('ro@ro.com', 'Rodrigo', '1234ceara'),
    'zeh@zeh.com': new User('zeh@zeh.com', 'Zeh', '1234ceara')
};
