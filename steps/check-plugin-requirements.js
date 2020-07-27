"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ensurePluginRequirementsAreMet = void 0;

var _url = _interopRequireDefault(require("url"));

var _fetchGraphql = _interopRequireDefault(require("../utils/fetch-graphql"));

var _formatLogMessage = require("../utils/format-log-message");

var _getGatsbyApi = require("../utils/get-gatsby-api");

var _store = _interopRequireDefault(require("../store"));

var _supportedRemotePluginVersions = require("../supported-remote-plugin-versions");

const areRemotePluginVersionsSatisfied = async ({
  helpers,
  url: wpGraphQLEndpoint
}) => {
  let wpgqlIsSatisfied;
  let wpGatsbyIsSatisfied;

  try {
    const {
      data
    } = await (0, _fetchGraphql.default)({
      query:
      /* GraphQL */
      `
        query WPGatsbyCompatibility(
          $wpgqlVersion: String!
          $wpgatsbyVersion: String!
        ) {
          wpGatsbyCompatibility(
            wpGatsbyVersionRange: $wpgatsbyVersion
            wpGQLVersionRange: $wpgqlVersion
          ) {
            satisfies {
              wpGQL
              wpGatsby
            }
          }
        }
      `,
      variables: {
        wpgqlVersion: _supportedRemotePluginVersions.supportedWpPluginVersions.WPGraphQL.version,
        wpgatsbyVersion: _supportedRemotePluginVersions.supportedWpPluginVersions.WPGatsby.version
      },
      panicOnError: false,
      throwGqlErrors: true
    });
    wpgqlIsSatisfied = data.wpGatsbyCompatibility.satisfies.wpGQL;
    wpGatsbyIsSatisfied = data.wpGatsbyCompatibility.satisfies.wpGatsby;
  } catch (e) {
    if (e.message.includes(`Cannot query field "wpGatsbyCompatibility" on type "RootQuery".`)) {
      helpers.reporter.panic((0, _formatLogMessage.formatLogMessage)(`Your version of WPGatsby is too old to determine if we're compatible.${_supportedRemotePluginVersions.genericDownloadMessage}`));
    } else {
      helpers.reporter.panic(e.message);
    }
  }

  const shouldDisplayWPGraphQLReason = !wpgqlIsSatisfied && _supportedRemotePluginVersions.supportedWpPluginVersions.WPGraphQL.reason;
  const shouldDisplayWPGatsbyReason = !wpGatsbyIsSatisfied && _supportedRemotePluginVersions.supportedWpPluginVersions.WPGatsby.reason;
  const shouldDisplayAtleastOneReason = shouldDisplayWPGraphQLReason || shouldDisplayWPGatsbyReason;
  const shouldDisplayBothReasons = shouldDisplayWPGraphQLReason && shouldDisplayWPGatsbyReason; // a message explaining why these are the minimum versions

  const reasons = `${shouldDisplayAtleastOneReason ? `\n\nReasons:\n\n` : ``}${shouldDisplayWPGraphQLReason ? `- ${_supportedRemotePluginVersions.supportedWpPluginVersions.WPGraphQL.reason}` : ``}${shouldDisplayBothReasons ? `\n\n` : ``}${shouldDisplayWPGatsbyReason ? `- ${_supportedRemotePluginVersions.supportedWpPluginVersions.WPGatsby.reason}` : ``}`;
  let message;

  if (!wpgqlIsSatisfied && wpGatsbyIsSatisfied) {
    message = `Your remote version of WPGraphQL is not within the accepted range (${_supportedRemotePluginVersions.supportedWpPluginVersions.WPGraphQL.version}).

\tDownload v ${_supportedRemotePluginVersions.supportedWpPluginVersions.WPGraphQL.version} at https://github.com/wp-graphql/wp-graphql/releases

\tIf you're upgrading from an earlier version, read the release notes for each version between your old and new versions to determine which breaking changes you might encounter based on your use of the schema.
${reasons}
`;
  }

  if (!wpGatsbyIsSatisfied) {
    const {
      hostname,
      protocol
    } = _url.default.parse(wpGraphQLEndpoint);

    message = `Your remote version of WPGatsby is not within the accepted range (${_supportedRemotePluginVersions.supportedWpPluginVersions.WPGatsby.version})

\tDownload v ${_supportedRemotePluginVersions.supportedWpPluginVersions.WPGatsby.version} at https://github.com/TylerBarnes/using-gatsby-source-wordpress-experimental/tree/master/WordPress/plugins or update via ${protocol}//${hostname}/wp-admin/plugins.php
${reasons}`;
  }

  if (!wpGatsbyIsSatisfied && !wpgqlIsSatisfied) {
    message = `WPGatsby and WPGraphQL are both outside the accepted version ranges.
visit https://github.com/TylerBarnes/using-gatsby-source-wordpress-experimental/tree/master/WordPress/plugins to download the latest versions.
${reasons}`;
  }

  if (message) {
    helpers.reporter.panic((0, _formatLogMessage.formatLogMessage)(message));
  }
};

const isWpGatsby = async () => (0, _fetchGraphql.default)({
  query:
  /* GraphQL */
  `
      {
        isWpGatsby
      }
    `,
  errorMap: {
    from: `Cannot query field "isWpGatsby" on type "RootQuery".`,
    // @todo replace this link with another once we're out of alpha
    to: `WPGatsby is not active in your WordPress installation.\nTo download the latest versions of WPGatsby and WPGraphL, visit:\nhttps://github.com/TylerBarnes/using-gatsby-source-wordpress-experimental/tree/master/WordPress/plugins`
  },
  panicOnError: true
});

const ensurePluginRequirementsAreMet = async (helpers, _pluginOptions) => {
  if (helpers.traceId === `refresh-createSchemaCustomization`) {
    return;
  }

  const {
    url,
    debug: {
      disableCompatibilityCheck
    }
  } = (0, _getGatsbyApi.getPluginOptions)();
  await isWpGatsby();

  if (!disableCompatibilityCheck) {
    await areRemotePluginVersionsSatisfied({
      helpers,
      url
    });
  }
};

exports.ensurePluginRequirementsAreMet = ensurePluginRequirementsAreMet;