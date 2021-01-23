'use strict';
const chai = require('chai');
const expect = chai.expect;

const refute = require( '../lib/refute.js' );

describe( 'deepEqual', () => {
    class Foo {
        constructor(arg) {
            this.arg = arg;
        }
    };

    // [ description, isPassing, got, expected, [ getDetails(1).diag ]
    const cases = [
        [
            'simple nested',
            true,
            ["foo", ["bar"], { quuz: 42 }],
            ["foo", ["bar"], { quuz: 42 }]
        ],
        [
            'function',
            false,
            x => x,
            x => x,
        ],
        [
            'diff type',
            false,
            { target: [] },
            { target: {} },
        ],
        [
            'diff keys',
            false,
            { foo: 42, bar: 137 },
            { bar: 137, quux: true },
        ],
        [
            'blessed vs unblessed',
            false,
            new Foo(42),
            {"arg":42},
        ],
        [
            'blessed vs blessed',
            true,
            new Foo([42]),
            new Foo([42]),
        ],
        [
            'same sets',
            true,
            new Set( "foo" ),
            new Set( "foo" ),
        ],
        [
            'different sets',
            true, // TODO
            new Set( "foo" ),
            new Set( "bar" ),
        ],
        [
            'multiple errors',
            false,
            [ { "foo": [42, 42]}, { "bar":137 }, { "quuz": true } ],
            [ { "foo": [42, 43]}, { "bar":137 }, { "quuz": false } ],
            (ok, lines) => {
                ok.diag( lines );
                ok.equal( lines.length, 6 );
            }
        ],
    ];

    for (let item of cases) {
        it( item[0], done => {
            const ok = refute.report( ok => {
                ok.diag( 'expecting '+(item[1] ? 'pass' : 'failure') );
                ok.deepEqual( item[2], item[3] );
            });
            if (!ok.isPassing())
                console.log(ok.getTap());

            if (ok.isPassing() !== item[1])
                throw new Error( ok.getTap() );

            if (item[4])
                refute( ok.getDetails(1).reason, item[4] );

            done();
        });
    };
});
