import gulp from "gulp";
import babel from "gulp-babel";
import mocha from "gulp-mocha";

function getAry(dir, files) {
    files = files || ['ExportData.js', '*.json', "*.spec.js"];
    return files.map(function (file) {
        return dir + file;
    });
}
const srcAry = getAry('./**/');

gulp.task('default', ['export']);

gulp.task('export', () => {
    return gulp.src(srcAry)
        .pipe(mocha({
            compilers: babel
        }));
});

gulp.task('watch-export', () => {
    gulp.watch(srcAry, ['export']);
});

gulp.task('build-export', () => {
    return gulp.src(srcAry)
        .pipe(babel())
        .pipe(gulp.dest('../../../dist/data/exportReports/'))
});

/**
 (2) in chai/mocha:
 (2.a)chaim/src/models/user/spec/agents.spec.js:
 beforeEach(() => {
	dummyAgents = require(path.join(__dirname, 'agents.json'));
});

 (2.b) chaim/src/data/exportReports/spec/ExportData.spec.js
 beforeEach(() => {
	const reportData = require(path.join(__dirname, 'loginData.json'));
	exportData = new ExportData('xls', reportData);
}
*/