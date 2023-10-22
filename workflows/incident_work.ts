// import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
// import { GetOnCalls } from "../functions/incident.ts";

// //https://api.slack.com/tutorials/tracks/hello-world
// export const IncidentWorkflow = DefineWorkflow({
//   callback_id: "start_incident",
//   title: "Start the incident process",
//   description: "Incident process initialisation automation",
//   input_parameters: {
//     properties: {
//       down_channel_name: {
//         type: Schema.types.string,
//       },
//     },
//     required: ["down_channel_name"],
//   },
// });

// //https://api.slack.com/reference/functions/create_channel
// const create_incident_channel = IncidentWorkflow.addStep(
//   Schema.slack.functions.CreateChannel,
//   {
//     channel_name: IncidentWorkflow.inputs.down_channel_name,
//     is_private: false,
//   },
// );

// const format_message_step = IncidentWorkflow.addStep(GetOnCalls, {
//   channel_id: create_incident_channel.outputs.channel_id,
// });

// IncidentWorkflow.addStep(Schema.slack.functions.SendMessage, {
//   channel_id: create_incident_channel.outputs.channel_id,
//   message: format_message_step.outputs.result,
// });

// export default IncidentWorkflow;
