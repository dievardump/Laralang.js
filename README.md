# What is it ?

A Simple JavaScript tool that allows you to use Laravel's way of Internationalization in JavaScript


# Installation

```
npm install --save laralang
```

# Initialization & Configuration

## set dictionnaries to use

Using an object with `{ local => values, local_2: values }`

```js
import lang from 'laralang';

// using dictionnaries
lang.setDictionnaries({
	en: {
		foo: 'bar',
		a: {
			b: {
				c: {
					d: 'e'
				}
			}
		},
		replace: ':param and :param_2 are parameters',
	},
	fr: {
		foo: 'bar',
		fallback: 'Utilisation du français avec paramètre :param'
	}
});

// OR

lang.addDictionnary('en', {
	foo: 'Bar'
});
```

## set fallback language
```
lang.setFallback('fr');
```

## return key if not found
Default is false and will return null if does not find the key

Setting this parameter to true allow you to clearly see missing keys in your dictionnary

```
lang.setReturnKeyIfNotFound(true);
```

## disable dictionnary

When dictionnary is disabled, the raw text will be used when replacing parameters, or looking for intervals

```js
lang.useDictionnary(false);
```

# Usage

## parameter replacement
```js
import { __ } from 'laralang';

console.log(__('foo')); // "bar"
console.log(__('a.b.c.d')); // "e"
console.log(__('replace', { param: 'foo', param_2: 'bar'})); // "foo and bar are parameters"
console.log(__('fallback', { param: 'foo' })); // "Utilisation du français avec paramètre foo"
```


```js
import lang, { trans_choice } from 'laralang';

// disable usage of dictionnary to work with raw key
// using setReturnKeyIfNotFound(true) would do the same thing if text is not a key in dictionnaries
lang.useDictionnary(false);


const text = '{4,5} Only 4 and 5|[0, 10] Only 0 to 10 except 4 and 5 with :parameter|All the others (:bar)';

console.log(trans_choice(text, 4)); // "Only 4 and 5"
console.log(trans_choice(text, 2, { parameter : 'foo' })); // "Only 0 to 10 except 4 and 5 with foo"
console.log(trans_choice(text, 42, { bar : 'test' })); // "All the others with (42)"
```
