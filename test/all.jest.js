import lang, { __, trans_choice } from "../";

const dictionnaries = {
	"en": {
		"foo": {
			"bar": "foobar"
		},
		"replace": "I am :param, and I am :param2",
		"multiple": "I am 1|I am the others",
		"multiple-params": "I am :param1 or :param0|I am :param3",
		"intervals": "{2} Only 2|[0,5] Between 0 and 5 (except 2)|[6,*] Others"
	},
	"fr": {
		"trout": "truite"
	}
};

describe("configuration", () => {
	it("loads the dictionnary", () => {
		lang.addDictionnaries(dictionnaries);
		const loaded = lang.getDictionnaries();
		const keys = Object.keys(loaded);

		expect(keys.length).toBe(2);
	});

	it("Set locals and fallbacks", () => {
		lang.setLocale("en");
		lang.setFallback("fr");

		expect(lang.isLocale("en")).toBe(true);
		expect(lang.isLocale("fr")).toBe(false);

		expect(lang.isFallback("fr")).toBe(true);
		expect(lang.isFallback("en")).toBe(false);
	});

	it('ReturnKeyIfNotFound is disabled', () => {
		expect(__('a.b.c.d')).toBe(null);
	});

	it('ReturnKeyIfNotFound is enabled', () => {
		lang.setReturnKeyIfNotFound(true);
		expect(__('a.b.c.d')).toBe('a.b.c.d');
	});
});

describe("usage", () => {
	it("finds path", () => {
		expect(__("foo.bar")).toBe(dictionnaries.en.foo.bar);
	});

	it("fallbacks when key does not exists", () => {
		expect(__("trout")).toBe(dictionnaries.fr.trout);
	});
});

describe("parameters replacement", () => {
	it("replaces parameters", () => {
		const replaced = __("replace", {
			param: "foo",
			param2: "bar"
		});

		expect(replaced).toBe("I am foo, and I am bar");
	});

	it("Choices", () => {
		expect(trans_choice('multiple', 1)).toBe('I am 1');
		expect(trans_choice('multiple', 10)).toBe('I am the others');
	});

	it("Choices with params", () => {
		expect(trans_choice('multiple-params', 1, {
			param1: '1',
			param0: '0',
			param3: 'more'
		})).toBe('I am 1 or 0');

		expect(trans_choice('multiple-params', 10, {
			param1: '1',
			param0: '0',
			param3: 'more'
		})).toBe('I am more');
	});
});

describe('Intervals and Set selection', () => {
	it("Set", () => {
		expect(trans_choice('intervals', 2)).toBe('Only 2');
	});

	it("Interval", () => {
		expect(trans_choice('intervals', 4)).toBe('Between 0 and 5 (except 2)');
		expect(trans_choice('intervals', 10)).toBe('Others');
	});
});

