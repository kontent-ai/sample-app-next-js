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
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  }
}
