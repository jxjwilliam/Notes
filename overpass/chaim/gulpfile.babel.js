import gulp from "gulp";
import babel from "gulp-babel";
import mocha from "gulp-mocha";

function getAry(dir, files) {
	files = files || [
			'userCredentialsCrud.server.js',
			"spec/agents.spec.js"
		];
	return files.map(function (file) {
		return dir + file;
	});
}
const srcAry = getAry('./**/');


gulp.task('default', ['agents-convert']);

gulp.task('agents-convert', () => {
	return gulp.src(srcAry)
		.pipe(mocha({
			compilers: babel
		}));
});

gulp.task('watch-agents-convert', () => {
	gulp.watch(srcAry, ['agents-convert']);
});

gulp.task('build-agents-convert', () => {
	return gulp.src(srcAry)
		.pipe(babel())
		.pipe(gulp.dest('../../../dist/models/user/'))
});

//~: william
