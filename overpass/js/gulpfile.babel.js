import gulp from "gulp";
import babel from "gulp-babel";
import mocha from "gulp-mocha";
import path from "path";

function getAry(dir, files) {
	files = files || ['*.js', "*.spec.js"];
	return files.map(function (file) {
		return dir + file;
	});
}

const taskName = "agents";

const srcAry = getAry('./spec/');

gulp.task('default', [taskName]);

gulp.task(taskName, () => {
	return gulp.src(srcAry)
		.pipe(mocha({
			compilers: babel
		}));
});

gulp.task('watch-'+taskName, () => {
	gulp.watch(srcAry, [taskName]);
});

gulp.task('build-'+taskName, () => {
	return gulp.src(srcAry)
		.pipe(babel())
		.pipe(gulp.dest('../../../../../dist/environment/dashboard/campaign/monitor/agents'))
});
