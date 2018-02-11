{ pkgs ? import <nixpkgs> {} }:
let
  yarn2nix = import (pkgs.fetchFromGitHub (let
    revs = builtins.fromJSON (builtins.readFile ./yarn2nix.json);
  in {
    owner = "moretea";
    repo = "yarn2nix";

    inherit (revs) rev sha256;
  })) { inherit pkgs; };
in
yarn2nix.mkYarnPackage {
  name = "nixos-packages-explorer";
  src = ./.;
  packageJson = ./package.json;
  yarnLock = ./yarn.lock;
  yarnNix = ./yarn.nix;

  postInstall = ''
    rm -rf website
    bash bin/webpack -p --output-path website
    mv website/ $out/website
  '';
}
