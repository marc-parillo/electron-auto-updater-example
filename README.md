# electron-auto-updater-example

This is a **fork** (not my own work) of the [Auto Update](https://github.com/electron-userland/electron-builder/wiki/Auto-Update) feature included within the [Electron Builder](https://github.com/electron-userland/electron-builder) module that is used to package and deploy your Electron app.

I've tested a few packaging/deployment options and I believe Electron Builder with its Auto Update feature is the best.

The existing documentation is not clear on how to make it work on a GitHub private repo and I tried several variations of the code before I realized how to make it work -- with a big warning about security (see below).

Look inside `main.js` for an example of the `autoUpdater.setFeedURL` function that sets the configuration options Auto Update need in order to peek inside a private repo to get the latest Release of your app.

The Auto Update feature works ideally with public repos because there is no need to include a GitHub personal access token in your code in order to enable auto updates.

The only way that I know of (in May 2017) to enable Auto Update using a private repo is to include a GitHub Personal Access token in the JavaScript that kicks off the main process (main.js in this repo).

This, as you suspect, is a **BIG SECURITY RED FLAG** because of the access provided by that token.  The bearer of this token has READ/WRITE access to your repos!

[How to create a personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

[More about GitHub Access Token scopes](https://developer.github.com/v3/oauth/#scopes)

I will be thinking of creative ways of including this token in my app without exposing it in plain text but, for now, this is an acceptable risk for my particular project because I am building an inner-office app and I personally know everyone in the office who will be using it.

The real answer is for GitHub to create a Personal Access Token scope that allows READ-ONLY access to public and private repos.  That will free us up to add the token to our code without worrying about the bad guys.  