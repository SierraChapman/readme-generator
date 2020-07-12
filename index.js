// Import libraries using require
const fs = require("fs");
const inquirer = require("inquirer");

// Function to validate something was inputted
function isNotEmpty(inputStr) {
    if (inputStr) {
        return true;
    } else {
        return "This is a required field.";
    }
}

// Console.log introductory message
console.log("\nWelcome to the readme generator.\n")

// Prompt user to input information using inquirer
inquirer
    .prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the project?",
            validate: isNotEmpty
        },
        {
            type: "input",
            name: "description",
            message: "Describe the project:",
            validate: isNotEmpty
        },
        {
            type: "input",
            name: "installation",
            message: "Enter the command to install dependencies:"
        },
        {
            type: "input",
            name: "usage",
            message: "What does the user need to know about using the product?"
        },
        {
            type: "list",
            name: "license",
            message: "What is the license for the software?",
            choices: ["MIT", "Apache-2.0", "GPLv3", "Other", "None"]
        },
        {
            type: "input",
            name: "otherLicense",
            message: "Enter license name:",
            when: answers => (answers.license === "Other"),
        },
        {
            type: "input",
            name: "contributing",
            message: "What do developers need to know about contributing to the application?"
        },
        {
            type: "input",
            name: "tests",
            message: "Enter the command to run tests:"
        },
    ])
    .then(answers => {
        // Determine license name
        let licenseName;
        if (answers.license === "None") {
            licenseName = "";
        } else if (answers.license === "Other") {
            licenseName = answers.otherLicense;
        } else {
            licenseName = answers.license;
        }

        // Construct README string from input using string literals
        let readmeString = `# ${answers.title}\n\n`;
        if (licenseName) {
            readmeString += `![${licenseName} license](https://img.shields.io/badge/license-${licenseName.split(" ").join("_").split("-").join("--")}-blue.svg)\n\n`;
        }
        readmeString += `## Description\n\n${answers.description}\n\n`;
        let tableOfContents = "## Table of Contents\n\n";
        let readmeBody = "";

        // Function to add a section
        function addSection(sectionName, sectionText, codeSnippet) {
            // Empty strings in sectionText or codeSnippet mean we shouldn't add section
            if (sectionText === "" || codeSnippet === "") return;

            // Add to readmeBody
            readmeBody += `## ${sectionName}\n\n${sectionText}\n\n`;

            if (codeSnippet) {
                readmeBody += "```\n" + codeSnippet + "\n```\n\n";
            }

            // Add to tableOfContents
            tableOfContents += `* [${sectionName}](#${sectionName.toLowerCase().split(" ").join("-")})\n\n`;
        }

        // Add sections
        addSection("Installation", "After downloading this repository, run the following command inside the repository to install the necessary dependencies:", answers.installation);
        addSection("Usage", answers.usage);
        if (licenseName) addSection("License", `This project is licensed under the ${licenseName} license.`);
        addSection("Contributing", answers.contributing);
        addSection("Tests", "To run tests, run the following command:", answers.tests);

        readmeString += tableOfContents + readmeBody;

        // Choose and create output location
        // output-n where n is the minimum integer that is greater than the rest 
        let outputDir = "output-0";

        // See what files are in current directory
        fs.readdir(".", (err, fileArray) => {
            if (err) throw err;

            fileArray.forEach(fileName => {
                // If the file has a larger number than outputDir, make outputDir larger
                if (fileName.slice(0, 7) === "output-" && parseInt(fileName.slice(7)) >= parseInt(outputDir.slice(7))) {
                    outputDir = "output-" + (parseInt(fileName.slice(7)) + 1);
                }
            });

            fs.mkdir(outputDir, err => {
                if (err) throw err;

                    // Write string to README file using fs
                    fs.writeFile(outputDir + "/README.md", readmeString, err => {
                        if (err) throw err;

                        // Console.log success message containing output location
                        console.log("\nFile saved at " + outputDir + "/README.md\n");
                });
            });
        });
  })
  .catch(error => {
    throw error;
  });