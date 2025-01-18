module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default : {
                options: {
                    additionalFlags: '--resolveJsonModule'
                },
                tsconfig: './tsconfig.json'
            }
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
};