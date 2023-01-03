# Testing Locally

1. Clone the repo
2. From the root, run yarn start

# Publishing a Release

### Release Branch

1. Checkout main locally
2. Increment the version number in packages/react-arborist/package.json
3. Create a branch called release/v0.0.0
4. Open a PR to main
5. Test, review, and merge

### Create Github Release

1. Create a release based on main
2. Assign a new tag to be created with v0.0.0
3. Write release notes
4. Publish

The Github actions workflow will publish to npm.
