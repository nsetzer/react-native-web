

export function serialize(obj) {
    const strings = Object.keys(obj).reduce(function(a,k) {
        if (Array.isArray(obj[k])) {
            for (var i=0; i < obj[k].length; i++) {
                a.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k][i]));
            }
        } else {
            a.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]));
        }
        return a
    }, [])
    return '?' + strings.join('&')
}