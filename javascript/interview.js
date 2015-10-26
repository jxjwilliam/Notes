//1.
var ary=["a", "b", "c", "b", "d", "d", "b"];
var uniq_ary=[];
ary.map(function(v) { if(uniq_ary.indexOf(v)===-1) { uniq_ary.push(v); } });

//setTimeout:
//1. function: copy value
var fn = function(i) {
  return function() {
	console.info(i);
  }
}
for(i=0; i<5; i++) {
	setTimeout(fn(i), 100);
}
//this also works: setTimeout('console.log(12345)', 100)
function fn(i) {
  	console.info(i);
}
for(i=0; i<5; i++) {
	setTimeout(fn(i), 100);
}

//2. bind: create new function, same as (1)
//The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
for(i=0; i<5; i++) {
	setTimeout(console.log.bind(console, i), 100);
}

//3. IIFE, pass value instead of reference
for(i=0; i<5; i++) {
	(function(i) {
		setTimeout(function() {
			console.log(i);
		}, 100);
	}(i));
}

//4. inside setTimeout, do the IIFE:
for(i=0; i<5; i++) {
    setTimeout((function(i) {
    	return function() {    
			console.log(i);
		}
	}(i)), 100); //5
}

//5. code: use call() to pass value instead of reference
//The call() method calls a function with a given this value and arguments provided individually.
for(i=0; i<5; i++) {
	setTimeout(function() {
		console.log(i);
	}.call(i), 100);
}
//equals:
var fn = function() { console.log(i); }
setTimeout(fn.call(i), 100);


//6. use apply() to pass value instead of reference
//The apply() method calls a function with a given this value and arguments provided as an array (or an array-like object).
for(i=0; i<5; i++) {
	setTimeout(function() {
		console.log(i);
	}.apply(i), 100);
}



//6 ways to get unique values of an Array in Javascript
Array.prototype.unique1 = function()
{
	var n = []; 
	for(var i = 0; i < this.length; i++) 
	{
		if (n.indexOf(this[i]) == -1) n.push(this[i]);
	}
	return n;
}
Array.prototype.unique2 = function()
{
	var n = {},r=[];
	for(var i = 0; i < this.length; i++) 
	{
		if (!n[this[i]]) 
		{
			n[this[i]] = true; 
			r.push(this[i]); 
		}
	}
	return r;
}
Array.prototype.unique3 = function()
{
	var n = [this[0]]; 
	for(var i = 1; i < this.length; i++) 
	{
		if (this.indexOf(this[i]) == i) n.push(this[i]);
	}
	return n;
}
Array.prototype.unique4 = function()
{
	this.sort();
	var re=[this[0]];
	for(var i = 1; i < this.length; i++)
	{
		if( this[i] !== re[re.length-1])
		{
			re.push(this[i]); 
		}
	}
	return re;
} 
Array.prototype.unique5 = function(){
    var self = this;
    var _a = this.concat().sort();
    _a.sort(function(a,b){
        if(a == b){
            var n = self.indexOf(a);
            self.splice(n,1);
        }
    });
    return self;
};
Array.prototype.unique6 = function()
{
	return this.reduce(function(p, c)
	{
		if (p.indexOf(c) < 0) p.push(c);
		return p;
	}, []); 
};