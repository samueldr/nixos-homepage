import React from "react";
import get from "lodash/get";
import {use} from "../state";
import FormattedLicense, {isUnfree} from "../license";
import Link from "../link";

/**
 * Platforms this widget shows.
 */
const PLATFORMS = [
	// "i686-linux",
	// "aarch64-linux",
	"x86_64-linux",
];

const Result = ({
	result,
	result: {name, attr, meta: {description} = {}},
	even,
	selected,
	select_attr,
}) =>
	<tr
		class={[
			"result",
			even ? "even" : "odd",
			selected === attr ? "is-selected" : "is-not-selected",
			isUnfree(result["meta"]["license"]) ? "is-unfree" : "is-free",
		].join(" ")}
		onClick={() => select_attr(attr)}
	>
		<td>
			<button
				onClick={(e) => {
					e.stopPropagation();
					select_attr(attr);
				}}
			>{name}</button>
		</td>
		<td>{attr}</td>
		<td>{description}</td>
	</tr>
;

export default use(["selected"], ["select_attr"], Result);

const NotSpecified = () => <em>Not specified</em>;
const hydraLink = (attribute, platform, branch) => `https://hydra.nixos.org/job/${branch}/nixpkgs.${attribute}.${platform}`;
const githubLink = (commit, position) => `https://github.com/NixOS/nixpkgs/blob/${commit}/${position.replace(":", "#L")}`;

const Install = use(["channel_data"], [], ({result, channel_data: {channel_name}}) =>
	<tr>
		<th>Install command</th>
		<td>
			<tt>
				<span class="command">
					nix-env -iA {channel_name}.<span class="attrname">{result["attr"]}</span>
				</span>
			</tt>
			{" "}<em class="muted">(NixOS channel)</em>
		</td>
	</tr>
);

const Unfree = ({result}) => {
	if (isUnfree(get(result, "meta.license"))) {
		return (
			<tr>
				<td colspan="2" class="unfree-note">
					<em>
						This package is unfree.
						See <a href="https://nixos.org/nixpkgs/manual/#sec-allow-unfree">chapter 6.2</a> of
						the manual for more informations.
					</em>
				</td>
			</tr>
		);
	}
};

const Position = use(["channel_data"], [], ({channel_data: {commit}, result: {meta: {position}}}) =>
	<tr>
		<th>Nix expression</th>
		<td>
			{
				position
					? <a href={githubLink(commit, position||"")}>
						{position.replace(/:[0-9]+$/, "")}
					</a>
					: <NotSpecified />
			}
		</td>
	</tr>
);

const channel_to_jobset = (channel) => {
	switch (channel) {
	case "nixos-unstable":
		return "nixos/trunk-combined";
	case "nixpkgs-unstable":
		return "nixpkgs/trunk";
	default:
		return channel.replace(/^nixos-/, "nixos/release-");
	}
};

// FIXME : Platforms have changed for 18.09...
const Platform = use(["channel"], [], ({channel, result: {attr, meta: {platforms}}}) =>
	<tr>
		<th>Platforms</th>
		<td>
			{
				!platforms || platforms.length < 1
					? <NotSpecified />
					: <ul class="platforms-list">
						{
							platforms
								.filter((platform) => PLATFORMS.indexOf(platform) > -1)
								.map((platform) =>
									<li key={platform}>
										<a href={hydraLink(attr, platform, channel_to_jobset(channel))}>
											<tt>{platform}</tt>
										</a>
									</li>
								)
						}
					</ul>
			}
		</td>
	</tr>
);

const Homepage = ({result: {meta: {homepage}}}) =>
	<tr>
		<th>Homepage</th>
		<td>
			{
				homepage && homepage.length > 0
					? <a href={homepage} rel="nofollow">{homepage}</a>
					: <NotSpecified />
			}
		</td>
	</tr>
;

const License = ({result: {meta: {license}}}) =>
	<tr>
		<th>License</th>
		<td>
			{
				license
					? <FormattedLicense license={license} />
					: <NotSpecified />
			}
		</td>
	</tr>
;

const Maintainers = ({result: {meta: {maintainers}}}) =>
	<tr>
		<th>Maintainers</th>
		<td>
			{
				maintainers && maintainers.length > 0
					? <span>
						{
							maintainers.map((m) => ( // eslint-disable-line
								typeof m === "string"
									// 17.09 and before are strings.
									? m
									// 18.03+ are structured objects.
									: `${m.name} <${m.email}>`
							)).join(", ")
						}
					</span>
					: <NotSpecified />
			}
		</td>
	</tr>
;

const LongDescription = ({result: {meta: {longDescription}}}) =>
	<tr>
		<th>Long description</th>
		<td class="long-description pre">
			{
				longDescription && longDescription.length > 0
					? <div>{longDescription}</div>
					: <NotSpecified />
			}
		</td>
	</tr>
;

const ROWS = [
	Install,
	Unfree,
	Position,
	Platform,
	Homepage,
	License,
	Maintainers,
	LongDescription,
];

const ResultDetails = ({
	result,
	result: {attr},
	even,
	selected,
}) =>
	<tr
		key="details"
		class={[
			"details",
			even ? "even" : "odd",
			selected === attr ? "is-selected" : "is-hidden",
			isUnfree(result["meta"]["license"]) ? "is-unfree" : "is-free",
		].join(" ")}
	>
		<td colspan={3}>
			<div class="search-details">
				<table>
					<tbody>
						{ROWS.map((Row, i) => <Row result={result} key={i} />)}
					</tbody>
				</table>
				<div class="result--permalink">
					<Link merge={true} state={{attr}}>
						Link to <tt>{attr}</tt>
					</Link>
				</div>
			</div>
		</td>
	</tr>
		;

const ResultDetailsWrapped = use(["selected"], [], ResultDetails);
export {ResultDetailsWrapped as ResultDetails};
