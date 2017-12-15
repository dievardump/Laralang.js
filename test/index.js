import lang, { __, trans_choice } from '../dist/index';
import dictionnaries from './dictionnaries.json';

lang.addDictionnaries(dictionnaries);
lang.setLocale('en');
lang.setFallback('fr');

console.log(__('trout'));
console.log(__('replace', {
	param: 'parameter',
	param2: 'another parameter'
}));
console.log(trans_choice('multiple', 1));
console.log(trans_choice('multiple', 10));
console.log(trans_choice('multiple-params', 1, {
	param1: '1',
	param0: '0',
	param3: 'more'
}));
console.log(trans_choice('multiple-params', 10, {
	param1: '1',
	param0: '0',
	param3: 'more'
}));

console.log(trans_choice('intervals', 2));
console.log(trans_choice('intervals', 4));
console.log(trans_choice('intervals', 10));

console.log(__('foo.bar'));

console.log(__('a.b.c.d'));
lang.setReturnKeyIfNotFound('true');
console.log(__('a.b.c.d'));