// Import libraries using require
const fs = require("fs");
const inquirer = require("inquirer");

// Console.log introductory message

// Prompt user to input information using inquirer

// Construct README string from input using string literals
let readmeString = "# Test File";

// Choose and create output location
// output-n where n is the minimum integer that is greater than the rest 
let outputDir = "output-0";

// See what files are in current directory
fs.readdir(".", (err, fileArray) => {
    if (err) throw err;

    fileArray.forEach(fileName => {
        // If the file has a larger number than outputDir, make outputDir larger
        if (fileName.slice(0, 7) === "output-" && fileName.slice(7) >= outputDir.slice(7)) {
            outputDir = "output-" + (parseInt(fileName.slice(7)) + 1);
        }
    });

    fs.mkdir(outputDir, err => {
        if (err) throw err;

            // Write string to README file using fs
            fs.writeFile(outputDir + "/README.md", readmeString, err => {
                if (err) throw err;

                // Console.log success message containing output location
                console.log("File saved at " + outputDir + "/README.md");
        });
    });
});