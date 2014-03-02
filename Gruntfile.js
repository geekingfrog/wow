module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      all: {
        files: ["**/*"],
        tasks: ["sass", "default"],
        options: {
          nospawn: true,
          interrupt: false,
          debounceDelay: 250
        }
      }
    },

    reload: {
      port: 35729,
      liveReload: {},
      proxy: {
        host: "0.0.0.0",
        port: 8080
      }
    },

    sass: {
      dev: {
        files: {
          'test.css': 'test.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-reload");
  grunt.loadNpmTasks("grunt-sass");

  grunt.registerTask("default", ["reload", "watch"]);
  grunt.registerTask("foo", ["sass"]);
};
