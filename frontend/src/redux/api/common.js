

export function serialize(obj) {
    const strings = Object.keys(obj).reduce(function(a,k) {
        a.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]));
        return a
    }, [])
    return '?' + strings.join('&')
}