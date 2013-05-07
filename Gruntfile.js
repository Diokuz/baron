module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      def: {
        files: {
          'dist/<%= pkg.name %>.js': [ 'src/core.js', 'src/fix.js' ],
          '<%= pkg.name %>.js': [ 'src/core.js', 'src/fix.js' ]
        }
      },
      core: {
        src: [
          'src/core.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      full: {
        // src: [
        //   'src/core.js',
        //   'src/fix.js',
        //   'src/test.js'
        // ],
        // dest: 'dist/<%= pkg.name %>.js'
        files: {
          'dist/<%= pkg.name %>.js': [ 'src/core.js', 'src/fix.js', 'src/test.js' ],
          'demo/<%= pkg.name %>.full.js': [ 'src/core.js', 'src/fix.js', 'src/test.js' ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      def: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js'],
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
        }
      },
      core: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.core.dest %>'],
          '<%= pkg.name %>.min.js': ['<%= concat.core.dest %>']
        }
      },
      full: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js'],
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat:def', 'uglify:def']);
  grunt.registerTask('core', ['concat:core', 'uglify:core']);
  grunt.registerTask('full', ['concat:full', 'uglify:full']);

};