const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

function deliveryProject(projectId, studentId, deliveries) {
  const baseUrl = "https://bootcamp.hub.driven.com.br";
  const path = "/project-deliveries/cli-delivery";
  const apiKey = process.env.API_KEY;

  const data = {
    projectId,
    studentId,
    deliveries,
  };

  return axios({
    method: "POST",
    url: `${baseUrl}${path}`,
    data,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": `Bearer ${apiKey}`,
    },
  });
}

module.exports = deliveryProject;
