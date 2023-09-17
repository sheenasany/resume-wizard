const axios = require("axios");
require("dotenv").config();

// Check if OPENAI_API_KEY is defined
if (!process.env["OPENAI_API_KEY"]) {
  console.error("OPENAI_API_KEY is not defined. Please check your .env file.");
  process.exit(1);
}

// console.log(`Using API Key: ${process.env["OPENAI_API_KEY"]}`);

class LLM {
  constructor() {
    this.apiKey = process.env["OPENAI_API_KEY"];
    this.extractPersonDetails = [
      {
        name: "extractPersonDetails",
        description: "extract personal details from resume text",
        parameters: {
          type: "object",
          properties: {
            firstname: {
              type: "string",
              description: "first name from resume eg john",
            },
            lastname: {
              type: "string",
              description: "last name from resume eg doe",
            },
            email: {
              type: "string",
              description: "email from resume eg john@gmail.com",
            },
            phonenumber: {
              type: "string",
              description: "phone number from resume eg 1234567890",
            },
            link1: {
              type: "string",
              description: "link from resume eg linkedin.com/johndoe",
            },
            link2: {
              type: "string",
              description: "link from resume eg github.com/johndoe",
            },
            link3: {
              type: "string",
              description: "link from resume eg personalwebsite.com/johndoe",
            },
          },
          required: ["firstname", "lastname", "email", "phonenumber"],
        },
      },
    ];
    this.extractPersonSkills = [
      {
        name: "extractPersonSkills",
        description: "extract list of skills from resume text",
        parameters: {
          type: "object",
          properties: {
            skills: {
              type: "string",
              description:
                "list of skills from resume eg ['python','java', 'gcp', 'aws']",
            },
          },
          required: ["skills"],
        },
      },
    ];
    this.extractPersonEducation = [
      {
        name: "extractPersonEducation",
        description: "extract list of education from resume text",
        parameters: {
          type: "object",
          properties: {
            education: {
              type: "object",
              description:
                "a json array of education from resume eg [{'name':'FIU', 'degree':'Bachelors of Science', 'major':'Computer Science', 'graduationDate':'2021'}]",
              properties: {
                name: {
                  type: "string",
                  description:
                    "name of education from resume such as colleges and bootcamps eg FIU, 4geeks",
                },
                degree: {
                  type: "string",
                  description: "degree from resume eg Bachelors of Science",
                },
                major: {
                  type: "string",
                  description:
                    "major from resume eg Computer Science, business, engineering",
                },
                graduationDate: {
                  type: "string",
                  description:
                    "graduation date from resume eg 2021, 2022, 2023",
                },
              },
            },
          },
          required: ["name", "degree", "major", "graduationDate"],
        },
      },
    ];
    this.extractPersonExperience = [
      {
        name: "extractPersonExperience",
        description: "extract an array of experiences from resume text",
        parameters: {
          type: "object",
          properties: {
            experience: {
              type: "object",
              description:
                " a json array of experiences from resume eg [{'name':'google', 'title':'software engineer', 'company':'google', 'start':'2021', 'end':'2022', 'description':'built a website using react and python'}], must return the job object in an array",
              properties: {
                title: {
                  type: "string",
                  description:
                    "job title from resume eg software engineer, data scientist",
                },
                company: {
                  type: "string",
                  description:
                    "name of company from resume eg google, facebook",
                },
                start: {
                  type: "string",
                  description:
                    "start date from resume eg 2021, 2022, 2023 or november 2021, april 2022",
                },
                end: {
                  type: "string",
                  description:
                    "end date from resume eg 2021, 2022, 2023 or november 2021, april 2022",
                },
                description: {
                  type: "string",
                  description:
                    "job description from resume eg built a website using react and python",
                },
              },
            },
          },
          required: ["title", "company", "start", "end", "description"],
        },
      },
    ];
    this.extractJobDetails = [
      {
        name: "extractJobDetails",
        description:
          "extract job details from job description text, return json object",
        parameters: {
          type: "object",
          properties: {
            experience: {
              type: "object",
              description: "",
              properties: {
                description: {
                  type: "string",
                  description:
                    "job description from job description text eg a SaaS company is looking for a software engineer to build a website using react and python",
                },
                responsibilities: {
                  type: "string",
                  description:
                    "job responsibilities from job description text eg take requirements from product manager and convert them to business logic",
                },
                requirements: {
                  type: "string",
                  description: "job requirements from job description text eg ",
                },
                compensation: {
                  type: "string",
                  description:
                    "job compensation from job description text eg $50,000 to $100,000",
                },
                benefits: {
                  type: "string",
                  description:
                    "a summary of the job benefits from job description text eg we offer health insurance, dental insurance, and 401k",
                },
                companyvalues: {
                  type: "string",
                  description:
                    "a summary of the company values from job description text eg we value diversity, inclusion, and teamwork",
                },
                deadline: {
                  type: "string",
                  description:
                    "a deadline for the job application from job description text eg 2021-10-10",
                },
                regularhours: {
                  type: "string",
                  description:
                    "Get Job regularhours of job from job description text the type is one of the following: fulltime, parttime, contract, internship, temporary, or volunteer",
                },
              },
            },
          },
          required: [
            "description",
            "responsibilities",
            "requirements",
            "compensation",
            "benefits",
            "companyvalues",
            "deadline",
            "type",
          ],
        },
      },
    ];
    this.extractJobSkills = [
      {
        name: "extractJobSkills",
        description:
          "extract a list of technical job skills from job description text",
        parameters: {
          type: "object",
          properties: {
            skills: {
              type: "object",
              description:
                "returns a json array of technical job skills from job description text eg [{'name':'python', 'description':'python is a programming language'}]",
              properties: {
                Skillname: {
                  type: "string",
                  description:
                    "technical job skill or requirement from job description text eg python, java, docker, aws, gcp",
                },
                skilldescription: {
                  type: "string",
                  description:
                    "a short summarized description of technical job skills from job description and the experience level text eg intermediate python is a programming language",
                },
              },
            },
          },
          required: ["name", "description"],
        },
      },
    ];
    this.extractJobLocation = [
      {
        name: "extractJobLocation",
        description: "extract job location from job description text",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "object",
              description:
                "returns a details of the jobs location from job description text eg [{'city':'miami', 'state':'florida', 'country':'united states', 'remote':'false'}] ",
              properties: {
                city: {
                  type: "string",
                  description:
                    "extract city from job description text eg miami, new york, san francisco",
                },
                state: {
                  type: "string",
                  description:
                    "extract state from job description text eg florida, new york, california",
                },
                country: {
                  type: "string",
                  description:
                    "extract country from job description text eg united states, canada, mexico",
                },
                remote: {
                  type: "string",
                  description:
                    "extract remote from job description text eg true, false",
                },
              },
            },
          },
          required: ["city", "state", "country", "remote"],
        },
      },
    ];
    this.summary = [
      {
        name: "summary",
        description: "a long detailed summary of text, include all details",
        parameters: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description: "summary of text",
            },
          },
        },
        required: ["city", "state", "country", "remote"],
      },
    ];
    this.analyze = [
      {
        name: "analyze",
        description:
          "a list of strong critiques when comparing the resume to the job description eg [{'critique':'experience', 'details':'you dont have enought experience for this job, the job requires 4 years and you only have 3'}, {'critique':'education', 'details':'you have a bachelors of science in computer science'}]",
        parameters: {
          type: "object",
          properties: {
            critiques: {
              type: "string",
              description: "critique of resume and job description ",
            },
          },
        },
        required: ["critiques"],
      },
    ];
  }

  async callOpenAi(messages, function_call) {
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const data = {
      model: "gpt-4",
      messages,
      functions: function_call,
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data.choices[0];
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

// (async () => {
//   try {
//     const apiWrapper = new LLM();
//     const messages = [
//       {
//         role: "system",
//         content: "You are a helpful assistant."
//       },
//       {
//         role: "user",
//         content: `Rowan Wolf Osmon\nSoftware Engineering New Grad, University Oclearf Washington\nrowanosmon@gmail.com\n253-225-1563`
//       }
//     ];
//     const res = await apiWrapper.callOpenAi(messages, apiWrapper.extractPersonDetails);
//     const json = JSON.parse(res.message.function_call.arguments);
//     console.log(json);
//   } catch (error) {
//     console.error("Failed to extract details:", error);
//   }
// })();
