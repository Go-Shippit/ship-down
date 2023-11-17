import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const MarkdownMessage = DefineFunction({
  callback_id: "markdown_message",
  source_file: "functions/markdown_message.ts",
  title: "Create a markdown message. Substitute users into %u",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.types.string,
      },
      user_ids: {
        type: Schema.types.string,
      },
      format_str: {
        type: Schema.types.string,
      },
    },
    required: ["channel_id", "user_ids", "format_str"],
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
  MarkdownMessage,
  async ({ inputs, client }) => {
    const conversationId: string = inputs.channel_id;
    const user_ids: string[] = inputs.user_ids.split(",");
    const format_str: string = inputs.format_str;

    //console.log(`.${conversationId}.`);
    //console.log(inputs.user_ids);

    const users = user_ids.map((u) => {
      return `<@${u}>`;
    }).join(",");

    const output_txt = format_str.replace("%u", users);

    const res = await client.chat.postMessage(
      {
        channel: conversationId,
        blocks: [{
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": output_txt,
          },
        }],
      },
    );

    //console.log(res);

    return {
      outputs: {
        result: res.ok ? "success" : "error",
      },
    };
  },
);
