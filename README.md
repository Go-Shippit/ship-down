# Ship Down - Slack App
A PagerDuty to Slack intergration

## Workflow Functions
* **get_oncalls** - from an PD schedule ID, returns the emails and slack IDs of the oncall for current time.
* **add_oncalls** - adds slack users (slack IDs) to the slack usergroup (slack ID)

## OAuth2
* [Slack](https://api.slack.com/automation/external-auth)
* [PageDuty](https://developer.pagerduty.com/docs/3ec0d67458b0b-obtaining-a-user-o-auth-token-via-code-grant)
   * Note: Classic Auth as email endpoint is not supported with Scoped.

## Deployment
* [Slack CLI](https://api.slack.com/automation/cli/install)