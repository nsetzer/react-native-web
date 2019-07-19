

import {
    patternToRegexp,
    locationMatch,
    patternMatch,
    patternCompile
} from "./Route"


it('test patternToRegexp', () => {

    var result;
    expect(patternToRegexp("/").re).toEqual(/^\/$/i)
    expect(patternToRegexp("/abc").re).toEqual(/^\/abc\/?$/i)

    result = patternToRegexp("/:name")
    expect(result.tokens).toEqual(['name'])
    expect(result.re).toEqual(/^\/([^\/]+)\/?$/i)

    result = patternToRegexp("/:name?")
    expect(result.tokens).toEqual(['name'])
    expect(result.re).toEqual(/^\/([^\/]*)\/?$/i)

    result = patternToRegexp("/:name+")
    expect(result.tokens).toEqual(['name'])
    expect(result.re).toEqual(/^\/(.+)\/?$/i)

    result = patternToRegexp("/:name*")
    expect(result.tokens).toEqual(['name'])
    expect(result.re).toEqual(/^\/(.*)\/?$/i)

});


it('test patternToRegexp Match', () => {

    var obj;
    var result;

    result = "/".match(patternToRegexp("/").re)
    expect(result[0]).toEqual('/')

    result = "/abc".match(patternToRegexp("/").re)
    expect(result).toEqual(null)

    result = "/abc".match(patternToRegexp("/abc").re)
    expect(result[0]).toEqual('/abc')

    // test zero or one

    result = "/".match(patternToRegexp("/:name?").re)
    expect(result[0]).toEqual('/')
    expect(result[1]).toEqual('')

    result = "/abc".match(patternToRegexp("/:name?").re)
    expect(result[0]).toEqual('/abc')
    expect(result[1]).toEqual('abc')

    result = "/abc/def".match(patternToRegexp("/:name?").re)
    expect(result).toEqual(null)

    // test one or more

    result = "/".match(patternToRegexp("/:name+").re)
    expect(result).toEqual(null)

    result = "/abc".match(patternToRegexp("/:name+").re)
    expect(result[0]).toEqual('/abc')
    expect(result[1]).toEqual('abc')

    result = "/abc/def".match(patternToRegexp("/:name+").re)
    expect(result[0]).toEqual('/abc/def')
    expect(result[1]).toEqual('abc/def')

    // test zero or more

    result = "/".match(patternToRegexp("/:name*").re)
    expect(result[0]).toEqual('/')
    expect(result[1]).toEqual('')

    result = "/abc".match(patternToRegexp("/:name*").re)
    expect(result[0]).toEqual('/abc')
    expect(result[1]).toEqual('abc')

    result = "/abc/def".match(patternToRegexp("/:name*").re)
    expect(result[0]).toEqual('/abc/def')
    expect(result[1]).toEqual('abc/def')

});


it('test patternMatch', () => {

    var result;
    expect(patternMatch("/:name", "/")).toEqual(null)
    expect(patternMatch("/:name", "/test")).toEqual({'name': 'test'})
    expect(patternMatch("/:name", "/test/test")).toEqual(null)

    expect(patternMatch("/:name?", "/")).toEqual({'name': ''})
    expect(patternMatch("/:name?", "/test")).toEqual({'name': 'test'})
    expect(patternMatch("/:name?", "/test/test")).toEqual(null)

    expect(patternMatch("/:name+", "/")).toEqual(null)
    expect(patternMatch("/:name+", "/test")).toEqual({'name': 'test'})
    expect(patternMatch("/:name+", "/test/test")).toEqual({'name': 'test/test'})

    expect(patternMatch("/:name*", "/")).toEqual({'name': ''})
    expect(patternMatch("/:name*", "/test")).toEqual({'name': 'test'})
    expect(patternMatch("/:name*", "/test/test")).toEqual({'name': 'test/test'})
});

it('test patternCompile', () => {


    var toPath;

    toPath = patternCompile('/:name')
    expect(toPath({name: 'test'})).toEqual('/test')
});