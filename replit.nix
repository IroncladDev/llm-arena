{ pkgs }: {
    deps = [
      # pkgs.openssl.out
      pkgs.postgresql
      pkgs.bun
        pkgs.yarn
        pkgs.esbuild
        pkgs.nodejs_20

        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
        pkgs.openssl_1_1
  ];
  #   env = {
  #     LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.openssl_1_1.out   pkgs.libuuid.lib
  #   pkgs.libressl
  # ];
  #   };
}