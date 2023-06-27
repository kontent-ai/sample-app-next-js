module.exports = {
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
  async redirects() {
    return [
      {
        source: '/articles',
        destination: `/articles/category/all`,
        permanent: true,
      }
    ]
  },
}
