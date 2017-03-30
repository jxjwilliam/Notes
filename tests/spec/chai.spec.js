import chai, { expect, assert } from 'chai.spec';
import sinon from 'sinon';
import path from 'path';
import fs from  'fs';
import reportData from './data.json';

chai.should();

describe('sum function test', () => {
	let sum;
	before(()=> {
		sum = (...figures) => {
			return figures.reduce((total, current) => {
				return total + current;
			});
		}
	});

	it('should sum function work', () => {
		let result = sum(1, 1);
		expect(result).to.equal(2);
		expect(sum(20, 8)).to.equal(28);
		sum(6, 9).should.equal(15);
	});
});

describe('data json file test', () => {
	it('should data.json exist', () => {
		const dataFile = require(path.join(__dirname, 'data.json'));
		dataFile.should.exist;
	});

	it('should import data.json', () => {
		reportData.should.be.an('array');
	});
});

class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	get height() {
		return this._height;
	}

	set height(value) {
		if (typeof value !== 'number') {
			throw new Errow('"height" must be a number.');
		}
		this._height = value;
	}

	get width() {
		return this._width;
	}

	set width(value) {
		if (typeof value !== 'number') {
			throw new Error('"width" must be a number.');
		}
		this._width = value;
	}

	get area() {
		return this.width * this.height;
	}

	get circumference() {
		return 2 * this.width + 2 * this.height;
	}
}

describe('Rectangle class test', () => {
	describe('#constructor()', () => {

		it('requires 2 numerical arguments', () => {
			(()=> {
				new Rectangle();
			}).should.throw(Error);

			(() => {
				new Rectangle(1.0);
			}).should.throw(Error);

			(() => {
				new Rectangle('foo', 'bar');
			}).should.throw(Error);

			(() => {
				new Rectangle(6, 9);
			}).should.not.throw(Error);
		});
	});

	describe('#width', () => {
		let rectangle;

		beforeEach(()=> {
			rectangle = new Rectangle(10, 20);
		});

		it('should return the width', () => {
			rectangle.width.should.equal(10);
		});

		it('can be changed', () => {
			rectangle.width = 30;
			rectangle.width.should.equal(30);
		});

		it('only accepts number values', () => {
			(() => {
				rectangle.width = 'foo';
			}).should.throw(Error);
		});
	});

	describe('#height', () => {
		let rectangle;

		beforeEach(() => {
			rectangle = new Rectangle(10, 20);
		});

		it('returns the height', () => {
			rectangle.height.should.equal(20);
		});

		it('can be changed', () => {
			rectangle.height = 30;
			rectangle.height.should.equal(30);
		});

		it('only accepts numerical values', () => {
			(() => {
				rectangle.height = 'foo';
			}).should.throw(Error);
		});
	});

	describe('#area', () => {
		let rectangle;

		beforeEach(() => {
			rectangle = new Rectangle(10, 20);
		});

		it('returns the area', () => {
			rectangle.area.should.equal(200);
		});

		it('can not be changed', () => {
			(() => {
				rectangle.area = 1000;
			}).should.throw(Error);
		});
	});

	describe('#circumference', () => {
		let rectangle;

		beforeEach(() => {
			rectangle = new Rectangle(10, 20);
		});

		it('returns the circumference', () => {
			rectangle.circumference.should.equal(60);
		});

		it('can not be changed', () => {
			(() => {
				rectangle.circumference = 1000;
			}).should.throw(Error);
		});
	});
});

