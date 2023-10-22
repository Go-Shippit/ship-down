import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const AddOnCalls = DefineFunction({
  callback_id: "add_oncalls",
  source_file: "functions/usergroup.ts",
  title: "Add On Calls to Usergroup",
  input_parameters: {
    properties: {
      user_ids: {
        type: Schema.types.string,
      },
      usergroup_id: {
        type: Schema.types.string,
      },
    },
    required: ["user_ids", "usergroup_id"],
  },
  output_parameters: {
    properties: {
      result: {
        type: Schema.types.string,
      },
    },
    required: ["result"],
  },
});

export default SlackFunction(
  AddOnCalls,
  async ({ inputs, client }) => {
    let usergroup: string = inputs.usergroup_id;
    if (usergroup == "oncall-devs") {
      usergroup = "S05RVN8AQ03";
    }
    await client.usergroups.users.update({
      usergroup: usergroup,
      users: inputs.user_ids,
    });

    return {
      outputs: {
        result: "done",
      },
    };
  },
);
