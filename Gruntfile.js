module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },
      watchify: {
        files: 'src/worker/*',
        tasks: ['watchify']
      },
      options: {
        livereload: true,
      },
    },
    watchify: {
      worker: {
        src: './src/worker/worker.js',
        dest: './dist/worker/worker.js',
      },
      client: {
        src: './src/worker/client.js',
        dest: './dist/worker/client.js',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-watchify');

  // Tasks
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['watchify']);
};