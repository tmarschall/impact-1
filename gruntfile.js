module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      stylus: {
        compile: {
          options: {
            use: [
              require('autoprefixer-stylus'),
              require('csso-stylus'),
              require('stylus-normalize'),
              require('jeet'),
              require('rupture'),
            ]
          },
          files: {
            'style.css': 'styles/style.styl',
            'ie.css': 'styles/ie.styl'
          },
        },
      },
      uglify: {
        options: { compress: true },
        target: {
        files: {
        'js/vendor.min.js': require('wiredep')().js
        }
      }
    },
    watch: {
      stylus: {
        files: ['**/*.styl'],
        tasks: ['stylus'],
      },
      uglify: {
        files: ['js/libs/**/*'],
        tasks: ['uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default task(s).
  grunt.registerTask('default', ['stylus', 'uglify', 'watch']);

};