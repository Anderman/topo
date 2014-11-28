cookieObject = {};
cookieObject.get = function (cookieName) {
    var cookie = $.cookie(cookieName);
    return cookie ? JSON.parse(cookie) : {};
}
cookieObject.set = function (cookieName, obj, expires) {
    $.cookie(cookieName, JSON.stringify(obj), { expires: expires || 365 });
};
