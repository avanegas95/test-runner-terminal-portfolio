import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/#projects",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/#contact",
        permanent: true,
      },
      {
        source: "/known-issues",
        destination: "/#about",
        permanent: true,
      },
      {
        source: "/resume",
        destination: "/Anderson_Vanegas_Resume.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
