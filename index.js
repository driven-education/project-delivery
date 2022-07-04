const inquirer = require("inquirer");
const { schemaValidation, schemas } = require("./validation");
const deliveryProject = require("./delivery");
const { store, get } = require("./suggestions");

async function main() {
  const { projectId, studentId } = await inquirer.prompt([
    {
      type: "input",
      message: "Qual o id do projeto que deseja corrigir?",
      name: "projectId",
      validate: schemaValidation(schemas.numericIdSchema),
    },
    {
      type: "number",
      message: "Qual o ID do estudante?",
      name: "studentId",
      validate: schemaValidation(schemas.numericIdSchema),
    },
  ]);

  const deliveries = await readDeliveries();

  try {
    console.log("Enviando projeto...");
    await deliveryProject(projectId, studentId, deliveries);
    console.log("Projeto enviado com sucesso!");
    console.log(`ID do projeto: ${projectId}`);
    console.log(`ID do estudante: ${studentId}`);
    console.log("Entregas:");
    deliveries.forEach((delivery) => {
      console.log(`${delivery.type}: ${delivery.url}`);
    });
    console.log("========");
  } catch (err) {
    if (err.response.status === 401) {
      console.error(
        "Erro: API_KEY inválida. Crie um arquivo .env com valor para API_KEY. Caso não tenha, consulte seu coordenador de turma. Exemplo: API_KEY=123456789"
      );
    } else if (err.response.status === 400) {
      console.error("Erro: Dados inválidos.");
      console.error(err.response.data.message);
    } else {
      console.log(err.response);
      console.error(
        "Erro ao enviar projeto. Verifique os dados ou entre em contato com o suporte."
      );
      process.exit(1);
    }
  }
}

async function readDeliveries() {
  const deliveries = [];
  const deliverableTypes = ["front-end", "back-end", "deploy"];

  for (const deliverableType of deliverableTypes) {
    const { hasDeliverable } = await inquirer.prompt([
      {
        type: "confirm",
        message: `O projeto tem um link de ${deliverableType}?`,
        name: "hasDeliverable",
      },
    ]);

    if (hasDeliverable) {
      const url = await readDeliverableInfo(deliverableType);
      deliveries.push({ url, type: deliverableType });
    }
  }

  return deliveries;
}

async function readDeliverableInfo(deliverableType) {
  const validator = ["front-end", "back-end"].includes(deliverableType)
    ? schemaValidation(schemas.githubUrlSchema)
    : schemaValidation(schemas.urlSchema);

  const { url } = await inquirer.prompt([
    {
      type: "input",
      message: `Qual a url do ${deliverableType} do projeto?`,
      name: "url",
      validate: validator,
    },
  ]);

  return url;
}

main();
