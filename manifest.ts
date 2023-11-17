import { DefineOAuth2Provider, Manifest, Schema } from "deno-slack-sdk/mod.ts";

import { AddOnCalls } from "./functions/usergroup.ts";
import { GetOnCalls } from "./functions/incident.ts";
import { MarkdownMessage } from "./functions/markdown_message.ts";

//import { IncidentWorkflow } from "./workflows/incident_work.ts";

// Define a new OAuth2 provider
// Note: replace <your_client_id> with your actual client ID
const PagerDutyProvider = DefineOAuth2Provider({
  provider_key: "pagerduty",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    "provider_name": "PagerDuty",
    "authorization_url": "https://identity.pagerduty.com/oauth/authorize",
    "token_url": "https://identity.pagerduty.com/oauth/token",
    "client_id": "d1b6f8bf-c146-472f-9a42-9552cacaf51f",
    "scope": [
      "read",
    ],
    "authorization_url_extras": {
      "redirect_uri": "https://oauth2.slack.com/external/auth/callback",
    },
    "identity_config": {
      "url": "https://api.pagerduty.com/users/me",
      "account_identifier": "$.user.email",
    },
  },
});

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "ship-down-bot",
  description: "A slack integration with PagerDuty for Shippit Down",
  icon: "assets/alien.png",
  functions: [GetOnCalls, AddOnCalls, MarkdownMessage],
  workflows: [], //GetOnCallsIncidentWorkflow],
  outgoingDomains: ["api.pagerduty.com"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:manage",
    "groups:write",
    "users:read.email",
    "users:read",
    "usergroups:write",
  ],
  // Tell your app about your OAuth2 providers here:
  externalAuthProviders: [PagerDutyProvider],
});
