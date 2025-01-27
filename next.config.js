module.exports = {
  async redirects() {
    return [
      {
        source: '/articles/category/:category/page/([0-1])',
        destination: '/articles/category/:category',
        permanent: true,
      }
    ]
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  }
}
