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

// Store url's for coding languages/libraries
builtWithUrls = new Map([
    ["HTML", "https://developer.mozilla.org/en-US/docs/Web/HTML"], 
    ["CSS", "https://developer.mozilla.org/en-US/docs/Web/CSS"], 
    ["JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"], 
    ["SQL", "https://developer.mozilla.org/en-US/docs/Glossary/SQL"],
    ["Git", "https://git-scm.com/"],
    ["GitHub", "https://github.com/"],
    ["Heroku", "https://www.heroku.com/"],
    ["MySQL", "https://www.mysql.com/"],
    ["Google Fonts", "https://fonts.google.com/"], 
    ["Font Awesome", "https://fontawesome.com/"], 
    ["Bootstrap", "https://getbootstrap.com/"], 
    ["jQuery", "https://jquery.com/"], 
    ["Node.js", "https://nodejs.org/en/"], 
    ["Node Package Manager", "https://www.npmjs.com/"],
    ["axios", "https://www.npmjs.com/package/axios"], 
    ["Express.js", "https://expressjs.com/"],
    ["Inquirer.js", "https://www.npmjs.com/package/inquirer"],
    ["mysql (NPM module)", "https://www.npmjs.com/package/mysql"]
])

// Console.log introductory message
console.log("\nWelcome to the README generator. Answer the prompts to generate a README.\n")

// Prompt user to input information using inquirer
inquirer
    .prompt([
        {
            type: "input",
            name: "email",
            message: "What is your email address?",
            validate: isNotEmpty
        },
        {
            type: "input",
            name: "username",
            message: "What is your GitHub username?",
            validate: isNotEmpty
        },
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
            type: "input",
            name: "demonstration",
            message: "Enter path to GIF demonstrating usage:"
        },
        {
            type: "input",
            name: "codeSnippet",
            message: "Enter a code snippet to highlight (use \"\\n\" to separate lines):"
        },
        {
            type: "input",
            name: "codeExplanation",
            message: "What would you like to say about the code snippet?",
            when: answers => (answers.codeSnippet !== ""),
        },
        {
            type: "checkbox",
            name: "builtWith",
            message: "Which of the following were used in the project?",
            choices: Array.from(builtWithUrls.keys())
        },
        {
            type: "input",
            name: "deployedLink",
            message: "Enter the deployed link:"
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
            validate: isNotEmpty
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
        {
            type: "input",
            name: "acknowledgement1",
            message: "Enter acknowledgements (first of three max):"
        },
        {
            type: "input",
            name: "acknowledgement2",
            message: "Second acknowledgement:",
            when: answers => (answers.acknowledgement1 !== "")
        },
        {
            type: "input",
            name: "acknowledgement3",
            message: "Third acknowledgement:",
            when: answers => (answers.acknowledgement1 !== "" && answers.acknowledgement2 !== "")
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
        if (answers.demonstration) addSection("Demonstration", `![Demonstration of application](${answers.demonstration})`);
        addSection("Code Explanation", answers.codeExplanation, answers.codeSnippet);
        if (answers.builtWith) {
            let builtWithList = "";

            for (let i = 0; i < answers.builtWith.length; i++) {
                builtWithList += `* [${answers.builtWith[i]}](${builtWithUrls.get(answers.builtWith[i])})\n`;
            }

            addSection("Technologies Used", builtWithList);
        }
        if (answers.deployedLink) addSection("Deployed Link", `* [See Live Site](${answers.deployedLink})`);
        if (licenseName) addSection("License", `This project is licensed under the ${licenseName} license.`);
        addSection("Contributing", answers.contributing);
        addSection("Tests", "To run tests, run the following command:", answers.tests);
        if (answers.acknowledgement1) {
            let acknowledgements = "* " + answers.acknowledgement1;
            if (answers.acknowledgement2) {
                acknowledgements += "\n* " + answers.acknowledgement2;
                if (answers.acknowledgement3) {
                    acknowledgements += "\n* " + answers.acknowledgement3;
                }
            }
            addSection("Acknowledgements", acknowledgements);
        }
        addSection("Questions", `If you have any questions about the repo, open an issue or contact me directly at ${answers.email}. You can find more of my work at [${answers.username}](https://github.com/${answers.username}/).`);

        // Construct full readme
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
                        console.log("\nYour README file has been saved at " + outputDir + "/README.md\n");
                });
            });
        });
  })
  .catch(error => {
    throw error;
  });