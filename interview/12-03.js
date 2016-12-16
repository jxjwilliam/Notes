
1 == '1' // TRUE
1 === '1' //false


try {
	obj.property = 'aaa'
} catch (e) {
	console.log('try eror');
} // 'try error'

try{ 
	throw new Error('kkk'); //or: throw 'kkk'
}
catch(e) { 
	console.log('try error'); 
} // 'try error'


var pobj = {
  getName: function() {
     return this.name;
  }
}
function MyFunc(name) {
  this.name = name;
}
MyFunc.prototype = pobj
var myfunc = new MyFunc('william')

myfunc.getName(); //"william"