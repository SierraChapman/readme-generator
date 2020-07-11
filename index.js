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
        }
    ])
    .then(answers => {
        // Construct README string from input using string literals
        let readmeString = `# ${answers.title}\n\n${answers.description}\n\n`;
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