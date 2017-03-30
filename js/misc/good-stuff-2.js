
// TODO: try to dynamically assign name for log purpose.
(function() {
    var path = require('path');
    var fp = path.resolve(__dirname).substr(1).replace(/\//g, '::');
    function CFunc() {
        this.logPath = fp+'::'+this.constructor.name;
        this.getName = function() {
            console.log(this.logPath, 'name???');
        }
    }
    function func() {
        var logPath = fp+'::'+arguments.callee.name;
        console.log(logPath, 'dynamic assign path');
    }
    var instance = new CFunc();
    instance.getName();
    func();
});


// import uuid from 'node-uuid'; uuid.v1()
function guidGenerator () {
    const S4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
