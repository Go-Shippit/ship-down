import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import { get_email, get_oncall_ids } from "../pd.ts";

const oncalls = async (schedule_ids: string, external_token: string) => {
  const today = format(new Date(), "yyyy-MM-ddTHH:mm");

  //schedule_ids = "PVVPJY7,P845H43";
  const ids: string[] = await get_oncall_ids(
    schedule_ids,
    today,
    external_token,
  );
  //console.log(ids.join(","));

  const email_list: string[] = await Promise.all(ids.map((id) => {
    return get_email(id, external_token);
  }));

  //console.log(email_list.join(","));
  return email_list.join(",");
};

export const GetOnCalls = DefineFunction({
  callback_id: "get_oncalls",
  source_file: "functions/incident.ts",
  title: "Get On Call Staff",
  input_parameters: {
    properties: {
      pd_schedule_id: {
        type: Schema.types.string,
      },
      // Define token here
      pagerdutyAccessTokenId: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "pagerduty",
      },
    },
    required: ["pd_schedule_id"],
  },
  output_parameters: {
    properties: {
      oncall_emails: {
        type: Schema.types.string,
      },
      oncall_ids: {
        type: Schema.types.string,
        description: "OnCall Slack User IDs",
      },
    },
    required: ["oncall_emails", "oncall_ids"],
  },
});

export default SlackFunction(
  GetOnCalls,
  async ({ inputs, client }) => {
    // Get the token:
    const tokenResponse = await client.apps.auth.external.get({
      external_token_id: inputs.pagerdutyAccessTokenId,
    });
    if (tokenResponse.error) {
      const error =
        `Failed to retrieve the external auth token due to ${tokenResponse.error}`;
      return { error };
    }

    // If the token was retrieved successfully, use it:
    const externalToken: string = tokenResponse.external_token || "";
    //console.log(externalToken);

    // input sanitisation
    let input_ids: string = inputs.pd_schedule_id.replace(/\s/g, "");

    if (input_ids == "core") {
      input_ids = "PVVPJY7,P845H43";
    }

    const emails: string = await oncalls(input_ids, externalToken);

    //const email_list: string[] = emails.split(",");
    const user_id_list: any[] = await Promise.all(
      emails.split(",").map((e) => {
        return client.users.lookupByEmail({
          email: e,
        });
      }),
    );

    const ids: string[] = user_id_list.map((i) => {
      return i.user.id;
    });
    const oncalls_ids: string = ids.join(",");

    return {
      outputs: {
        oncall_emails: emails,
        oncall_ids: oncalls_ids,
      },
    };
  },
);
