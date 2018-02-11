import React from "react";
import {use} from "../state";

const Channels = ({channels, channel, set_channel}) =>
	<div>
		<select
			name="channel"
			class="channels-select span3"
			value={channel}
			onChange={(event) => set_channel(event.target.value)}
		>
			<option disabled value="" selected={!channels}> — Select a channel — </option>
			{channels.map((c) => <option key={c} value={c}>{c}</option>)}
		</select>
	</div>
;

export default use(
	[
		"channel",
		"channels"
	],
	["set_channel"],
	Channels
);
