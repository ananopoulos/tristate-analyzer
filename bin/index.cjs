const { analyze } = require("../lib/index.cjs");
const dotenv = require('dotenv');
dotenv.config();

const argv = require("yargs/yargs")(process.argv.slice(2))
  .option("data", {
    alias: "d",
    type: 'string',
    describe: "the data string to be analyzed"
  })
  .option("passFail", {
    alias: "p",
    type: 'boolean',
    default: false,
    describe: "use pass-fail criteria"
  })
  .demandOption(["data"])
  .help().argv;

const openApiKey = process.env.OPENAI_API_KEY;
const maxTokens = 100;

let tristateAnalyzerConfig = {
  yesCriteria: "positive customer review",
  noCriteria: "negative customer review",
  unknownCriteria: "the customer review is neither positive nor negative"
}

if (argv.passFail) {
  tristateAnalyzerConfig = {
    yesCriteria: "75% or more of the supplied statements are true",
    noCriteria: "74% or less of the supplied statements are false",
    unknownCriteria: "the supplied statements can not be analyzed"
  }
}

analyze(openApiKey, maxTokens, tristateAnalyzerConfig, argv.data).then((res) => {
  console.log(res);
});
