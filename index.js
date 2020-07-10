// Import libraries using require
const fs = require("fs");
const inquirer = require("inquirer");

// Console.log introductory message

// Prompt user to input information using inquirer

// Construct README string from input using string literals
let readmeString = "# Test File";

// Choose and create output location
const outputDir = "output";

fs.mkdir(outputDir, err => {
    if (err) throw err;

    // Write string to README file using fs
    fs.writeFile(outputDir + "/README.md", readmeString, err => {
        if (err) throw err;

        // Console.log success message containing output location
        console.log("File saved at " + outputDir + "/README.md");
    });
});