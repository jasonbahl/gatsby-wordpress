"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _clipboardy2 = _interopRequireDefault(require("clipboardy"));

var _prettier = _interopRequireDefault(require("prettier"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosRateLimit = _interopRequireDefault(require("axios-rate-limit"));

var _chalk = _interopRequireDefault(require("chalk"));

var _formatLogMessage = require("./format-log-message");

var _store = _interopRequireDefault(require("../store"));

var _getGatsbyApi = require("./get-gatsby-api");

const http = (0, _axiosRateLimit.default)(_axios.default.create(), {
  maxRPS: process.env.GATSBY_CONCURRENT_DOWNLOAD || 50
});

const handleErrors = async ({
  variables,
  pluginOptions,
  reporter,
  responseJSON,
  query,
  panicOnError,
  errorContext
}) => {
  if (variables && Object.keys(variables).length && pluginOptions.debug.graphql.showQueryVarsOnError) {
    reporter.error((0, _formatLogMessage.formatLogMessage)(`GraphQL vars: ${JSON.stringify(variables)}`));
  }

  try {
    query = _prettier.default.format(query, {
      parser: `graphql`
    });
  } catch (e) {// do nothing
  }

  if (pluginOptions.debug.graphql.showQueryOnError) {
    reporter.error((0, _formatLogMessage.formatLogMessage)(`GraphQL query: ${query}`));
  }

  if (pluginOptions.debug.graphql.copyQueryOnError) {
    try {
      await _clipboardy2.default.write(query);
    } catch (e) {// do nothing
    }
  }

  if (!responseJSON) {
    return;
  }

  if (!responseJSON.data || panicOnError || pluginOptions.debug.graphql.panicOnError) {
    reporter.panic((0, _formatLogMessage.formatLogMessage)(errorContext || `Encountered errors. See above for details.`));
  }
};

const handleGraphQLErrors = async ({
  query,
  variables,
  response,
  errorMap,
  panicOnError,
  reporter,
  errorContext
}) => {
  const pluginOptions = (0, _getGatsbyApi.getPluginOptions)();

  if (!response) {
    reporter.panic(response);
    return;
  }

  const json = response.data;
  const {
    errors
  } = json;

  if (!errors) {
    return;
  } // if we have json data, the error wasn't critical.


  if (json && json.data && pluginOptions.debug.graphql.onlyReportCriticalErrors) {
    return;
  }

  for (const error of errors) {
    var _error$path, _error$path$map, _errorPath;

    const errorWasMapped = errorMap && errorMap.from && errorMap.to && error.message === errorMap.from;

    if (errorWasMapped && panicOnError) {
      reporter.panic((0, _formatLogMessage.formatLogMessage)(errorMap.to));
    } else if (errorWasMapped) {
      reporter.error((0, _formatLogMessage.formatLogMessage)(errorMap.to));
    } // convert the error path array into a string like "mediaItems.nodes[55].mediaDetails.meta.focalLength"


    let errorPath = error === null || error === void 0 ? void 0 : (_error$path = error.path) === null || _error$path === void 0 ? void 0 : (_error$path$map = _error$path.map((field, index) => {
      // if this is a number it's the index of a node
      if (typeof field === `number`) {
        return `[${field}].`;
      } else if ( // otherwise if the next field isn't a number
      typeof error.path[index + 1] !== `number`) {
        // add dot notation
        return `${field}.`;
      } // or just return the field


      return field;
    })) === null || _error$path$map === void 0 ? void 0 : _error$path$map.join(``);

    if ((_errorPath = errorPath) === null || _errorPath === void 0 ? void 0 : _errorPath.endsWith(`.`)) {
      // trim "." off the end of the errorPath
      errorPath = errorPath.slice(0, -1);
    }

    if (error.debugMessage) {
      reporter.error((0, _formatLogMessage.formatLogMessage)(`Error category: ${error.category} \n\nError: \n  ${error.message} \n\n Debug message: \n  ${error.debugMessage} \n\n Error path: ${errorPath}`));
    } else {
      var _error$locations, _error$locations$map;

      reporter.error((0, _formatLogMessage.formatLogMessage)(`(${error.category}) ${(error === null || error === void 0 ? void 0 : (_error$locations = error.locations) === null || _error$locations === void 0 ? void 0 : _error$locations.length) ? (_error$locations$map = error.locations.map(location => `location: line ${location.line}, column: ${location.column}`)) === null || _error$locations$map === void 0 ? void 0 : _error$locations$map.join(`. `) : ``} \n\t ${error.message}  \n\n Error path: ${errorPath} \n\n If you haven't already, try adding ${_chalk.default.bold(`define( 'GRAPHQL_DEBUG', true );`)} to your wp-config.php for more detailed error messages.`));
    }
  }

  await handleErrors({
    responseJSON: json,
    variables,
    pluginOptions,
    reporter,
    query,
    panicOnError,
    errorContext
  });
};

const ensureStatementsAreTrue = `${_chalk.default.bold(`Please ensure the following statements are true`)} \n  - your WordPress URL is correct in gatsby-config.js\n  - your server is responding to requests \n  - WPGraphQL and WPGatsby are installed in your WordPress backend`; // @todo add a link to docs page for debugging

const genericError = ({
  url
}) => `GraphQL request to ${_chalk.default.bold(url)} failed.\n\n${ensureStatementsAreTrue}`;

const handleFetchErrors = async ({
  e,
  reporter,
  url,
  timeout,
  variables,
  pluginOptions,
  query,
  response,
  errorContext
}) => {
  await handleErrors({
    panicOnError: false,
    reporter,
    variables,
    pluginOptions,
    query,
    errorContext
  });

  if (e.message.includes(`timeout of ${timeout}ms exceeded`)) {
    reporter.error(e);
    reporter.panic((0, _formatLogMessage.formatLogMessage)(`It took too long for ${url} to respond (longer than ${timeout / 1000} seconds).\n\nEither your URL is wrong, you need to increase server resources, or you need to decrease the amount of resources each request takes.\n\nYou can configure how much resources each request takes by lowering your \`options.schema.perPage\` value from the default of 100 nodes per request.\nAlternatively you can increase the request timeout by setting a value in milliseconds to \`options.schema.timeout\`, the current setting is ${timeout}.\n\n${genericError({
      url
    })}`, {
      useVerboseStyle: true
    }));
  }

  const unauthorized = e.message.includes(`Request failed with status code 401`);
  const htaccessCredentials = pluginOptions.auth.htaccess;
  const missingCredentials = !htaccessCredentials.password || !htaccessCredentials.username;

  if (unauthorized && !missingCredentials) {
    reporter.panic((0, _formatLogMessage.formatLogMessage)(`Request failed with status code 401.\n\nThe HTTP Basic Auth credentials you've provided in plugin options were rejected.\nDouble check that your credentials are correct.
         \n${genericError({
      url
    })}`, {
      useVerboseStyle: true
    }));
  } else if (unauthorized) {
    reporter.panic((0, _formatLogMessage.formatLogMessage)(`Request failed with status code 401.\n\n Your WordPress instance may be protected with HTTP Basic authentication.\n If it is you will need to add the following to your plugin options:

        {
          resolve: \`gatsby-source-wordpress-experimental\`,
          options: {
            auth: {
              htaccess: {
                username: process.env.HTTPBASICAUTH_USERNAME,
                password: process.env.HTTPBASICAUTH_PASSWORD,
              }
            }
          }
        }
         \n${genericError({
      url
    })}`, {
      useVerboseStyle: true
    }));
  }

  const forbidden = e.message.includes(`Request failed with status code 403`);

  if (forbidden) {
    reporter.panic((0, _formatLogMessage.formatLogMessage)(`${e.message}\n\nThe GraphQL request was forbidden.\nIf you are using a security plugin like WordFence or a server firewall you may need to whitelist your IP address or adjust your firewall settings for your GraphQL endpoint.\n\n${errorContext}`));
  }

  if (response === null || response === void 0 ? void 0 : response.headers[`content-type`].includes(`text/html;`)) {
    reporter.panic((0, _formatLogMessage.formatLogMessage)(`${e.message} \n\nReceived HTML as a response. Are you sure ${url} is the correct URL?\n\nIf that URL redirects to the correct URL via WordPress in the browser, or you've entered the wrong URL in settings, you might receive this error.\nVisit that URL in your browser, and if it looks good, copy/paste it from your URL bar to your config.\n\n${ensureStatementsAreTrue}`, {
      useVerboseStyle: true
    }));
  }

  reporter.panic((0, _formatLogMessage.formatLogMessage)(`${e.message} ${errorContext ? `\n\n` + errorContext : ``}\n\n${genericError({
    url
  })}`, {
    useVerboseStyle: true
  }));
};

const fetchGraphql = async ({
  query,
  errorMap,
  ignoreGraphQLErrors = false,
  panicOnError = false,
  throwGqlErrors = false,
  throwFetchErrors = false,
  url = false,
  variables = {},
  headers = {},
  errorContext = false
}) => {
  const {
    helpers,
    pluginOptions
  } = _store.default.getState().gatsbyApi;

  const {
    url: pluginOptionsUrl
  } = pluginOptions;
  let {
    reporter
  } = helpers;

  if (!reporter || typeof reporter === `undefined`) {
    reporter = {
      panic: message => {
        throw new Error(message);
      },
      error: console.error
    };
  }

  if (!url) {
    url = pluginOptionsUrl;
  }

  const timeout = pluginOptions.schema.timeout;
  const htaccessCredentials = pluginOptions.auth.htaccess;
  const missingCredentials = !htaccessCredentials.password || !htaccessCredentials.username;
  let response;

  try {
    const requestOptions = {
      timeout,
      headers
    };

    if (!missingCredentials) {
      requestOptions.auth = htaccessCredentials;
    }

    response = await http.post(url, {
      query,
      variables
    }, requestOptions);
    const contentType = response.headers[`content-type`];

    if (!contentType.includes(`application/json;`)) {
      throw new Error(`Unable to connect to WPGraphQL.`);
    }
  } catch (e) {
    if (throwFetchErrors) {
      throw e;
    }

    await handleFetchErrors({
      e,
      reporter,
      url,
      timeout,
      variables,
      pluginOptions,
      query,
      response,
      errorContext
    });
  }

  if (throwGqlErrors && response.data.errors) {
    const stringifiedErrors = response.data.errors.map(error => error.message).join(`\n\n`);
    throw new Error(stringifiedErrors);
  }

  if (!ignoreGraphQLErrors) {
    await handleGraphQLErrors({
      query,
      variables,
      response,
      errorMap,
      panicOnError,
      reporter,
      url,
      timeout,
      errorContext
    });
  }

  return response.data;
};

var _default = fetchGraphql;
exports.default = _default;