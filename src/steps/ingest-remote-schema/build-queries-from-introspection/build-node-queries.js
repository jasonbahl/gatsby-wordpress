import store from "~/store"
import { getGatsbyApi } from "~/utils/get-gatsby-api"
import generateNodeQueriesFromIngestibleFields from "~/steps/ingest-remote-schema/build-queries-from-introspection/generate-queries-from-ingestable-types"

/**
 * buildNodeQueries
 *
 * Uses plugin options to introspect the remote GraphQL
 * source, run cache logic, and generate GQL query strings/info
 *
 * @returns {Object} GraphQL query info including gql query strings
 */
const buildNodeQueries = async () => {
  const { pluginOptions, helpers } = getGatsbyApi()

  const QUERY_CACHE_KEY = `${pluginOptions.url}--introspection-node-queries`

  let nodeQueries = await helpers.cache.get(QUERY_CACHE_KEY)

  const { schemaWasChanged } = store.getState().remoteSchema

  if (schemaWasChanged || !nodeQueries) {
    // regenerate queries from introspection
    nodeQueries = await generateNodeQueriesFromIngestibleFields()

    // and cache them
    await helpers.cache.set(QUERY_CACHE_KEY, nodeQueries)
  }

  // set the queries in our redux store to use later
  store.dispatch.remoteSchema.setState({
    nodeQueries,
  })

  return nodeQueries
}

export { buildNodeQueries }
